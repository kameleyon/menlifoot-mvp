import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE = 'https://v3.football.api-sports.io';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const API_KEY = Deno.env.get('API_FOOTBALL_KEY');
    if (!API_KEY) {
      throw new Error('API_FOOTBALL_KEY not configured');
    }

    const url = new URL(req.url);
    const category = url.searchParams.get('category') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const headers = {
      'x-apisports-key': API_KEY,
    };

    const newsItems: any[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Fetch transfers (Transfer News)
    if (category === 'all' || category === 'transfers') {
      console.log('Fetching transfers...');
      const transfersRes = await fetch(`${API_BASE}/transfers?team=33`, { headers }); // Manchester United as example
      const transfersData = await transfersRes.json();
      
      if (transfersData.response && transfersData.response.length > 0) {
        const recentTransfers = transfersData.response.slice(0, 5);
        recentTransfers.forEach((transfer: any) => {
          transfer.transfers?.forEach((t: any) => {
            newsItems.push({
              id: `transfer-${t.date}-${transfer.player.id}`,
              category: 'Transfer News',
              title: `${transfer.player.name} moves from ${t.teams.out.name} to ${t.teams.in.name}`,
              excerpt: `${transfer.player.name} has completed a ${t.type} transfer from ${t.teams.out.name} to ${t.teams.in.name}.`,
              date: t.date,
              image: transfer.player.photo,
              type: 'transfer',
              details: {
                player: transfer.player,
                from: t.teams.out,
                to: t.teams.in,
                type: t.type
              }
            });
          });
        });
      }
    }

    // Fetch World Cup 2026 Qualifiers (World Cup News)
    if (category === 'all' || category === 'worldcup') {
      console.log('Fetching World Cup qualifiers...');
      // FIFA World Cup Qualification - various confederations
      const wcLeagues = [
        { id: 32, name: 'CONCACAF' },   // World Cup Qualification CONCACAF
        { id: 34, name: 'CONMEBOL' },   // World Cup Qualification CONMEBOL
        { id: 36, name: 'UEFA' },       // World Cup Qualification UEFA
        { id: 29, name: 'AFC' },        // World Cup Qualification AFC
        { id: 30, name: 'CAF' },        // World Cup Qualification CAF
      ];

      for (const league of wcLeagues.slice(0, 2)) { // Limit API calls
        try {
          const fixturesRes = await fetch(
            `${API_BASE}/fixtures?league=${league.id}&season=2024&last=5`,
            { headers }
          );
          const fixturesData = await fixturesRes.json();

          if (fixturesData.response) {
            fixturesData.response.forEach((fixture: any) => {
              const homeScore = fixture.goals.home ?? 0;
              const awayScore = fixture.goals.away ?? 0;
              const winner = homeScore > awayScore ? fixture.teams.home.name : 
                            awayScore > homeScore ? fixture.teams.away.name : 'Draw';

              newsItems.push({
                id: `wc-${fixture.fixture.id}`,
                category: 'World Cup 2026',
                title: `${fixture.teams.home.name} ${homeScore} - ${awayScore} ${fixture.teams.away.name}`,
                excerpt: `World Cup Qualifier (${league.name}): ${winner !== 'Draw' ? winner + ' wins!' : 'Match ends in a draw.'}`,
                date: fixture.fixture.date.split('T')[0],
                image: fixture.league.logo,
                type: 'worldcup',
                details: {
                  fixture: fixture.fixture,
                  teams: fixture.teams,
                  goals: fixture.goals,
                  league: fixture.league
                }
              });
            });
          }
        } catch (e) {
          console.error(`Error fetching ${league.name}:`, e);
        }
      }
    }

    // Fetch upcoming fixtures (Match News)
    if (category === 'all' || category === 'matches') {
      console.log('Fetching upcoming matches...');
      // Premier League upcoming
      const fixturesRes = await fetch(
        `${API_BASE}/fixtures?league=39&season=2024&next=5`,
        { headers }
      );
      const fixturesData = await fixturesRes.json();

      if (fixturesData.response) {
        fixturesData.response.forEach((fixture: any) => {
          newsItems.push({
            id: `match-${fixture.fixture.id}`,
            category: 'Premier League',
            title: `${fixture.teams.home.name} vs ${fixture.teams.away.name}`,
            excerpt: `Upcoming match at ${fixture.fixture.venue.name} on ${new Date(fixture.fixture.date).toLocaleDateString()}.`,
            date: fixture.fixture.date.split('T')[0],
            image: fixture.league.logo,
            type: 'match',
            details: {
              fixture: fixture.fixture,
              teams: fixture.teams,
              venue: fixture.fixture.venue
            }
          });
        });
      }
    }

    // Fetch injuries (Injury News)
    if (category === 'all' || category === 'injuries') {
      console.log('Fetching injuries...');
      const injuriesRes = await fetch(
        `${API_BASE}/injuries?league=39&season=2024`,
        { headers }
      );
      const injuriesData = await injuriesRes.json();

      if (injuriesData.response) {
        injuriesData.response.slice(0, 5).forEach((injury: any) => {
          newsItems.push({
            id: `injury-${injury.player.id}-${injury.fixture.id}`,
            category: 'Injury Report',
            title: `${injury.player.name} - ${injury.player.reason}`,
            excerpt: `${injury.team.name}'s ${injury.player.name} is out due to ${injury.player.reason}. ${injury.player.type} injury.`,
            date: injury.fixture.date?.split('T')[0] || today,
            image: injury.player.photo,
            type: 'injury',
            details: {
              player: injury.player,
              team: injury.team,
              fixture: injury.fixture
            }
          });
        });
      }
    }

    // Fetch standings for Champions League updates
    if (category === 'all' || category === 'champions') {
      console.log('Fetching Champions League...');
      const clFixturesRes = await fetch(
        `${API_BASE}/fixtures?league=2&season=2024&last=5`,
        { headers }
      );
      const clData = await clFixturesRes.json();

      if (clData.response) {
        clData.response.forEach((fixture: any) => {
          const homeScore = fixture.goals.home ?? 0;
          const awayScore = fixture.goals.away ?? 0;

          newsItems.push({
            id: `cl-${fixture.fixture.id}`,
            category: 'Champions League',
            title: `${fixture.teams.home.name} ${homeScore} - ${awayScore} ${fixture.teams.away.name}`,
            excerpt: `UEFA Champions League: ${fixture.teams.home.name} ${homeScore > awayScore ? 'defeats' : homeScore < awayScore ? 'loses to' : 'draws with'} ${fixture.teams.away.name}.`,
            date: fixture.fixture.date.split('T')[0],
            image: fixture.league.logo,
            type: 'champions',
            details: {
              fixture: fixture.fixture,
              teams: fixture.teams,
              goals: fixture.goals
            }
          });
        });
      }
    }

    // Sort by date and limit
    newsItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const limitedNews = newsItems.slice(0, limit);

    console.log(`Returning ${limitedNews.length} news items`);

    return new Response(JSON.stringify({ 
      success: true, 
      news: limitedNews,
      categories: ['worldcup', 'transfers', 'champions', 'matches', 'injuries']
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching football news:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
