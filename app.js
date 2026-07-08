/**
 * CS TACTICAL HUB - APP LOGIC
 * Handles view routing and dynamic map card / detail page rendering.
 */

// ─── MAP DATA ──────────────────────────────────────────────────────────────

const MAPS = [
    {
        id: 'de_dust2',
        name: 'Dust II',
        abbr: 'D2',
        setting: 'Desert / Middle East',
        type: 'Bomb Defusal',
        difficulty: 2,
        accent: '#e8a045',
        setting_detail: 'An arid North African village baked under a scorching sun.',
        description: 'The most iconic map in Counter-Strike history. Dust II features two open bomb sites connected by long corridors, a central catwalk, and the infamous B tunnels. Its symmetrical design and long sight lines make it a staple for both casual and competitive play.',
        image: 'pictures/Dust_II_radar.png',
        callouts: ['Long A / Cat / Short A', 'Mid / Top Mid / B Doors', 'B Tunnels / B Platform / Car', 'CT Spawn / A Site / B Site'],
        detailedCallouts: {
            'A SITE': ['Default', 'Goose', 'Ninja', 'Elevator', 'Pit', 'Barrels', 'A Ramp'],
            'LONG A': ['Long Doors', 'Car', 'Blue', 'Long Corner', 'Pit'],
            'MID & SHORT': ['Xbox', 'Catwalk (Short)', 'Suicide', 'Mid Doors', 'Top Mid', 'Lower Tunnels'],
            'B SITE': ['B Tunnels', 'B Platform', 'Window', 'B Car', 'B Doors', 'Default'],
            'SPAWN AREAS': ['CT Spawn', 'T Spawn', 'T Plat', 'T Ramp', 'Outside Tunnels']
        },
        lineups: [
            { name: 'CT Spawn Smoke', type: 'Smoke', throwType: 'Regular', position: 'Long A — T-side corner near bin', description: 'Aim at the building near the antenna, slightly above the roofline corner. Regular throw. Blocks CTs from peeking you while your team crosses Long.' },
            { name: 'Long Cross Smoke', type: 'Smoke', throwType: 'Regular', position: 'T-side Long corner', description: 'Stand at the Long corner and aim slightly above and left of the Long door frame. Regular throw lands to cover the full cross through Long Doors.' },
            { name: 'B Window Smoke', type: 'Smoke', throwType: 'Jump-throw', position: 'Upper B Tunnels entrance', description: 'Stand feet diagonal on the wooden plank near B Tunnel entrance. Crosshair on the chipped top-left area of the top-right arch. Jump-throw bind required.' },
            { name: 'B Door Smoke', type: 'Smoke', throwType: 'Regular', position: 'Upper Tunnels — in front of box by pillar', description: 'Look straight up at the wooden roof boards and aim at the bottom-right corner. Regular throw (NOT jump-throw). Blocks CT spawn line-of-sight through B Doors.' },
            { name: 'Long Flash', type: 'Flash', throwType: 'Regular', position: 'T-side, before Long corner', description: 'Pop-flash around the Long corner: hug the wall and throw a standard left-click flash just over the corner. Blinds Long Doors CTs for a safe peek.' },
            { name: 'B Site Molotov', type: 'Molotov', throwType: 'Regular', position: 'B Tunnels exit', description: 'From the B Tunnels exit, aim at the top of the left wall and throw. The molotov clears the default CT position behind B Platform boxes.' }
        ],
        ct_strategy: 'Hold long doors from CT cross, control mid doors early. One player can solo B with proper tunnel control. Always have a player ready for a mid-to-B rotation.',
        t_strategy: 'Executing Long A with a flashbang over the A site doors is a classic opener. Smoking CT cross and long corners enables fast A site takes. B rush through tunnels with a smoke on window is reliable.',
        stats: { popularity: '#1', sites: '2 (A, B)', release: '2001' }
    },
    {
        id: 'de_mirage',
        name: 'Mirage',
        abbr: 'MR',
        setting: 'Moroccan Village',
        type: 'Bomb Defusal',
        difficulty: 2,
        accent: '#f0c040',
        setting_detail: 'A sun-bleached Moroccan medina with cramped alleyways.',
        description: 'Perhaps the most played map in professional CS, Mirage is a Moroccan-themed map featuring three main routes to two bomb sites. Mid control is crucial — the team that wins mid windows gains a decisive map-wide advantage through rotations and information.',
        image: 'pictures/mirage.webp',
        localVideos: [
            // ── A Site ──────────────────────────────────────────────────────
            { file: 'videos/Mirage/ASiteAllMollys_Mirage.mp4',             title: 'A Site — All Molotovs',                category: 'A SITE' },
            { file: 'videos/Mirage/ASiteStairsSmoke_Mirage.mp4',           title: 'A Site — Stairs Smoke',                category: 'A SITE' },
            { file: 'videos/Mirage/ASite_LampFlash_Mirage.mp4',            title: 'A Site — Lamp Flash',                  category: 'A SITE' },
            { file: 'videos/Mirage/CTsmoke_Mirage.mp4',                    title: 'A Site — CT Smoke',                    category: 'A SITE' },
            { file: 'videos/Mirage/Donk_AExec_Mirage.mp4',                 title: 'A Execute (Donk Style)',               category: 'A SITE' },
            // ── Mid ─────────────────────────────────────────────────────────
            { file: 'videos/Mirage/WindowSmoke_Mirage.mp4',                title: 'Mid — Window Smoke',                   category: 'MID' },
            { file: 'videos/Mirage/HowToBrakeWindowSmoke_Mirage.mp4',      title: 'Mid — How to Break Window Smoke',      category: 'MID' },
            { file: 'videos/Mirage/WindowAndShortSmokesFromTopMid_Mirage.mp4', title: 'Mid — Window + Short from Top Mid', category: 'MID' },
            { file: 'videos/Mirage/MidTopSmoke_Mirage.mp4',                title: 'Mid — Top Mid Smoke',                  category: 'MID' },
            { file: 'videos/Mirage/MidShortSmoke_Mirage.mp4',              title: 'Mid — Short Smoke',                    category: 'MID' },
            { file: 'videos/Mirage/ConSmoke_Mirage.mp4',                   title: 'Mid — Connector Smoke',                category: 'MID' },
            { file: 'videos/Mirage/ConSmoke_2_Mirage.mp4',                 title: 'Mid — Connector Smoke (Alt)',          category: 'MID' },
            { file: 'videos/Mirage/ConPlayerDefaulfUtil_Mirage.mp4',       title: 'Mid — Connector Default Utility',      category: 'MID' },
            // ── B Site ──────────────────────────────────────────────────────
            { file: 'videos/Mirage/BSiteShortSmoke_Mirage.mp4',            title: 'B Site — Short Smoke',                 category: 'B SITE' },
            { file: 'videos/Mirage/BSiteKitchenDoorSmoke_Mirage.mp4',      title: 'B Site — Kitchen Door Smoke',          category: 'B SITE' },
            { file: 'videos/Mirage/BSiteKitchenWindowSmoke_Mirage.mp4',    title: 'B Site — Kitchen Window Smoke',        category: 'B SITE' },
            { file: 'videos/Mirage/BAnchorDefaultPlay_Mirage.mp4',         title: 'B Site — Anchor Default Play',         category: 'B SITE' },
            { file: 'videos/Mirage/BEntryFlash_Mirage.mp4',                title: 'B Site — Entry Flash',                 category: 'B SITE' },
            { file: 'videos/Mirage/BRushFlash_Mirage.mp4',                 title: 'B Site — Rush Flash',                  category: 'B SITE' },
        ],
        callouts: ['A Ramp / Short / Palace', 'Mid / Window / Connector', 'B Apartments / Van / Short', 'CT / Jungle / Ticket Booth'],
        detailedCallouts: {
            'A SITE': ['A Ramp', 'Palace', 'Balcony', 'Dark (Under Palace)', 'Tetris', 'Fire Box', 'Triple', 'Default', 'Stairs', 'Ninja', 'CT'],
            'MID': ['Top Mid', 'Mid Boxes', 'Window (Sniper\'s Nest)', 'Connector', 'Jungle', 'Catwalk (Short)', 'Chair', 'Underpass'],
            'B SITE': ['B Apartments (Apps)', 'Kitchen (Market)', 'Van', 'Bench', 'Back Alley', 'Arches', 'E-Box'],
            'SPAWN AREAS': ['T-Spawn', 'CT-Spawn', 'T-Roof', 'Ticket Booth']
        },
        lineups: [
            { name: 'Window Smoke', type: 'Smoke', throwType: 'Jump-throw', position: 'T-Spawn — near trash cans / pillar', description: 'Align with the pillar or trash can geometry in T-spawn. Aim at a specific point on the roof structure and use a jump-throw bind. Smokes out the Window (Sniper\'s Nest) to safely take mid.' },
            { name: 'CT Smoke (A-Site)', type: 'Smoke', throwType: 'Jump-throw', position: 'T-base — against wall near A Ramp', description: 'Position against the wall in T-base area and aim at a specific point on the tower brickwork. Jump-throw. Blocks CTs from peeking A site from their spawn during executes.' },
            { name: 'Jungle Smoke', type: 'Smoke', throwType: 'Jump-throw', position: 'T-base (same area as CT smoke)', description: 'Thrown from the same T-base area as the Stairs and CT smokes. Blocks the Jungle/Connector angle on A site. Pair this with the CT smoke for a clean A execute.' },
            { name: 'Stairs Smoke', type: 'Smoke', throwType: 'Jump-throw', position: 'T-base', description: 'Blocks the Stairs angle into A site from the CT side. Pair with Jungle and CT smokes for a full 3-smoke A execute that opens up a clean site take.' },
            { name: 'Ticket Booth Flash', type: 'Flash', throwType: 'Regular', position: 'T-Spawn, before A Ramp', description: 'Left-click throw a flashbang over the A Ramp wall toward Ticket Booth. Blinds any CT pushed up toward Short and forces them back, buying time for your team to take Ramp control.' },
            { name: 'B Apps Molotov', type: 'Molotov', throwType: 'Regular', position: 'T-side B Apartments exit', description: 'From the B Apps exit, throw the molotov at the Van area on B site. Forces any CT behind Van to reposition, clearing a default bomb plant spot for your team.' }
        ],
        ct_strategy: 'Send two players to control mid window early. One anchors B from van/short, two hold A. Window control allows fast rotations to either site and denies T information.',
        t_strategy: 'Taking mid window smoke and controlling connector enables 3-way pressure on A or B. A take via short is fast but risky; slow B through apartments with utility is reliable.',
        stats: { popularity: '#2', sites: '2 (A, B)', release: '2012' }
    },
    {
        id: 'de_inferno',
        name: 'Inferno',
        abbr: 'INF',
        setting: 'Italian Village',
        type: 'Bomb Defusal',
        difficulty: 3,
        accent: '#e84545',
        setting_detail: 'A picturesque Italian hilltop village with narrow cobblestone streets.',
        description: 'Set in a sun-drenched Italian village, Inferno is defined by its tight corridors and the infamous Banana — the curving choke point leading to B site. Utility mastery is essential here; a well-timed smoke on Banana can swing the entire round.',
        callouts: ['Banana / B Site / Car / Porch', 'Mid / Arch / Library / Second Mid', 'A Apps / Balcony / Pit / Sandbags', 'CT / Coffins / Dark'],
        ct_strategy: 'Control banana aggressively early or cede it with molotovs. Hold A site from Arch and Library angles. A rotate from CT is fast, so a solo B anchor works if banana is controlled.',
        t_strategy: 'Banana control with a smoke on CT corner and car is the foundation of every B take. A splits via apartments and mid arch are equally powerful when Ts have utility to cover CT and Library.',
        stats: { popularity: '#3', sites: '2 (A, B)', release: '1999' }
    },
    {
        id: 'de_nuke',
        name: 'Nuke',
        abbr: 'NK',
        setting: 'Nuclear Facility',
        type: 'Bomb Defusal',
        difficulty: 3,
        accent: '#4ecb71',
        setting_detail: 'A two-storey industrial nuclear power plant with outdoor grounds.',
        description: 'Nuke is uniquely vertical — the only active-duty map with two bomb sites stacked on top of each other. The indoor gameplay requires sophisticated positioning, and the outdoor area (Ramp / Heaven) serves as a critical rotation route. Heavily CT-sided.',
        callouts: ['Outside / Ramp / Hut / Silo', 'Upper (A) / Lower (B) / Lobby', 'Secret / Squeaky / Vent', 'Radio / Trophy Room / Catwalk'],
        ct_strategy: 'CTs can rotate between A and B via vents faster than Ts can reposition. One CT holding outside denies information on ramp timing. Nuclear site rotations must be coordinated precisely.',
        t_strategy: 'Ts must commit to a site — faking is ineffective due to short CT rotations. Outside pressure forces CT attention while a team executes through lobby. Secret/vent rush is a surprise option.',
        stats: { popularity: '#4', sites: '2 (A, B)', release: '1999' }
    },
    {
        id: 'de_cache',
        name: 'Cache',
        abbr: 'CCH',
        setting: 'Chernobyl Exclusion Zone',
        type: 'Bomb Defusal',
        difficulty: 2,
        accent: '#4a9eff',
        setting_detail: 'An overgrown industrial complex near the Chernobyl exclusion zone.',
        description: 'Cache is a community-created classic set in the eerie Chernobyl exclusion zone. Open mid control via the Checkers/A Main junction is pivotal. The map rewards individual dueling skills and clear team rotations between the two bomb sites.',
        callouts: ['A Main / Heaven / Headshot / Boost', 'Mid / Checkers / Highway / Squeaky', 'B Main / B Site / Quad / Ivy', 'CT Spawn / Garage / Default'],
        ct_strategy: 'Holding mid from CT spawns denies T vision into A. One holding B garage while another takes early mid is a standard setup. A heaven angle with a rifle is powerful from CT side.',
        t_strategy: 'Smoking mid is vital for a safe A take. A double smoke on checkers and CT cross enables a free A execute. B can be rushed aggressively if CTs are slow to set up.',
        stats: { popularity: '#5', sites: '2 (A, B)', release: '2013' }
    },
    {
        id: 'de_overpass',
        name: 'Overpass',
        abbr: 'OVP',
        setting: 'Berlin, Germany',
        type: 'Bomb Defusal',
        difficulty: 3,
        accent: '#7b9ecf',
        setting_detail: 'A German urban park and underground canal system.',
        description: 'A visually rich German urban map featuring a canal running through the middle. Overpass has complex three-dimensional angles and multiple elevation levels. Canal control at B is one of the most contested chokepoints, and A short aggression defines the pace of most rounds.',
        callouts: ['A Short / Monster / Playground', 'Canal / B Site / Fountain / Party', 'Mid / Connector / Bathrooms', 'CT / Long / Coffee'],
        ct_strategy: 'Aggressive A short contact early denies T timing. One player lurks monster or connector to intercept mid-to-B rotations. Holding under B heaven with canal control is the classic anchor setup.',
        t_strategy: 'Pressuring A short with a flashbang while playing for canal is a strong read. A slow mid-to-B through connector with support is a methodical approach. Do not over-commit to canal under focused CT fire.',
        stats: { popularity: '#6', sites: '2 (A, B)', release: '2013' }
    },
    {
        id: 'de_vertigo',
        name: 'Vertigo',
        abbr: 'VTG',
        setting: 'Skyscraper Under Construction',
        type: 'Bomb Defusal',
        difficulty: 3,
        accent: '#00d4ff',
        setting_detail: 'A vertigo-inducing high-rise building with exposed edges and scaffolding.',
        description: 'Vertigo is unique — a skyscraper under construction where fall damage is a real threat. The map is compact and fast-paced, with T-side pressure revolving around mid control and ramp. CTs must coordinate between the two narrow sites on a single floor.',
        callouts: ['A Site / Ramp / Steps / Sandbag', 'Mid / T-Spawn-Side Mid / CT-Side Mid', 'B Site / B Ramp / Spawn / Scaffold', 'CT / Elevator Room'],
        ct_strategy: 'Holding mid from CT with one player at ramp denies early T pressure. B anchor behind default boxes is safe. Be aware of mid-to-B ramp flanks and communicate early.',
        t_strategy: 'Controlling mid early lets Ts pressure both sites. A execute from ramp with smokes on CT and sandbag is standard. B rushes with molotovs on CT positions can catch anchors off-guard.',
        stats: { popularity: '#7', sites: '2 (A, B)', release: '2019' }
    },
    {
        id: 'de_ancient',
        name: 'Ancient',
        abbr: 'ANC',
        setting: 'Mayan Temple Complex',
        type: 'Bomb Defusal',
        difficulty: 2,
        accent: '#2ecc71',
        setting_detail: 'A dense Mesoamerican jungle ruins and ancient stone temples.',
        description: 'Ancient is set among Mayan ruins, featuring jungle paths and enclosed temple chambers. The map offers diverse routes with a central mid cave that allows creative splays. A site has powerful angles from temple while B is an open area requiring solid utility control.',
        callouts: ['A Site / Temple / Donut / Main', 'Mid / Cave / Mid Top / CT Mid', 'B Site / B Main / Quad / Short', 'CT / Ramp / Library'],
        ct_strategy: 'Mid cave control with a rifle or AWP denies T map coverage early. Temple angles on A are powerful. One player passive at B short gives information on B intentions.',
        t_strategy: 'Mid cave control expands Ts\' options to split A or fast B. A temple smoke and cave smoke are the two key pieces for a clean A execute. B main entry with a molotov clears default boxes.',
        stats: { popularity: '#8', sites: '2 (A, B)', release: '2021' }
    },
    {
        id: 'de_anubis',
        name: 'Anubis',
        abbr: 'ANB',
        setting: 'Egyptian Canal City',
        type: 'Bomb Defusal',
        difficulty: 2,
        accent: '#f39c12',
        setting_detail: 'An ancient Egyptian city built along a lush Nile delta canal.',
        description: 'Anubis replaces the long-standing Dust II in the active duty pool and features an Egyptian canal city with ornate architecture. Mid connector control is pivotal, providing information and access to both sites. The map rewards coordinated CT retakes through narrow corridors.',
        callouts: ['A Site / Palace / Bridge / Stairs', 'Mid / Connector / Street / Water', 'B Site / Fountain / Canal / Ramp', 'CT / Alley / CT Bridge'],
        ct_strategy: 'Holding mid bridge from CT side early establishes a position of power. A palace stack can hold vs three approaches. B connector angle with an AWP from CT bridge is extremely powerful.',
        t_strategy: 'T-side revolves around taking mid or going straight to a site. Mid-to-A connector smokes enable a free split. B ramp + canal double push with molotovs clears the difficult CT positions.',
        stats: { popularity: '#9', sites: '2 (A, B)', release: '2023' }
    },
    {
        id: 'de_train',
        name: 'Train',
        abbr: 'TRN',
        setting: 'Soviet Rail Yard',
        type: 'Bomb Defusal',
        difficulty: 3,
        accent: '#90a4ae',
        setting_detail: 'An industrial Soviet-era train depot filled with freight cars.',
        description: 'Train is a classic CS map set in a gritty Soviet rail yard where freight trains provide both cover and chokepoints. The long sight lines and elevated positions create a high-skill-ceiling AWP duel environment. A site on Train is one of the most challenging takes in all of competitive CS.',
        callouts: ['A Site / Upper / Lower / Ivy / Z-Con', 'Mid / Ladder Room / Connector', 'B Site / Bomb Car / Headshot / Dogroom', 'CT / Alley / T-Side Alley'],
        ct_strategy: 'Hold upper train on A from an AWP position. One player can hold B headshot while two apply pressure on ladder room. Coordinating ladder room control denies T information.',
        t_strategy: 'Popping smokes on upper, lower, and ivy simultaneously opens up A for a take. B is hard to take with CTs hiding in dogroom and bomb car. Rely on A strategy with ladder room for a second pressure route.',
        stats: { popularity: '#10', sites: '2 (A, B)', release: '1999' }
    },
    {
        id: 'de_cbble',
        name: 'Cobblestone',
        abbr: 'CBL',
        setting: 'Medieval European Castle',
        type: 'Bomb Defusal',
        difficulty: 2,
        accent: '#9b59b6',
        setting_detail: 'A medieval castle and courtyard in the European countryside.',
        description: 'Cobblestone is a beloved CS:GO classic featuring a sprawling medieval European castle. Wide open areas create long AWP duels, especially on the iconic Long path. The map heavily rewards utility usage on both sides, and A drops from balcony is an infamous sneaky play.',
        callouts: ['Long / Drop / A Site / Balcony', 'Mid / Connector / Platform', 'B Site / B Doors / Patio', 'CT / Catwalk / Catwalk Tunnel'],
        ct_strategy: 'AWP on long is incredibly powerful for CTs. One player can peek B doors early. Catwalk connector control creates rotation pressure on any T entering mid.',
        t_strategy: 'Taking long with utility to clear drop is the foundation of A strategy. B doors push forces CT rotate. A coordinated A-B split via mid/connector can overwhelm a spread CT setup.',
        stats: { popularity: '#11', sites: '2 (A, B)', release: '2012' }
    },
    {
        id: 'cs_office',
        name: 'Office',
        abbr: 'OFF',
        setting: 'Corporate Office Building',
        type: 'Hostage Rescue',
        difficulty: 1,
        accent: '#1abc9c',
        setting_detail: 'A modern corporate headquarters with open offices and narrow hallways.',
        description: 'Office is one of the most popular casual maps in CS history. As a hostage rescue scenario, CTs must prevent Ts from holding while rescuing hostages. The map is heavily CT-sided and is known for thrilling entry fragging by Ts through the front lobby.',
        callouts: ['Front Hall / Main Lobby / Connector', 'Garage / IT Room / Truck', 'Back Hall / Office / Cubicles', 'CT Spawn / Hostage Room'],
        ct_strategy: 'CTs hold chokepoints into the back hallway and cubicles. Guarding garage from inside is safer than peeking. Pinch Ts entering from lobby with a player hidden in the office.',
        t_strategy: 'Aggressive rushes through front hall are T\'s best angle of attack. Throwing flashes and smokes at CT side of main lobby enables picks. Garage infiltration is a secondary route to flank the CT anchor.',
        stats: { popularity: '#12', sites: 'Hostage Rescue', release: '1999' }
    },
    {
        id: 'cs_italy',
        name: 'Italy',
        abbr: 'ITA',
        setting: 'Picturesque Italian Town',
        type: 'Hostage Rescue',
        difficulty: 1,
        accent: '#e67e22',
        setting_detail: 'A charming Italian village with terracotta rooftops and cobblestone streets.',
        description: 'Italy is a hostage rescue map set in a classic Mediterranean village. Ts control the map center and must prevent CTs from rescuing hostages. The chicken-filled village square and tight window angles make for chaotic and memorable rounds.',
        callouts: ['Mid / Top Mid / Window / Chicken', 'Kitchen / Apartments / Balcony', 'Rescue Route / Market / Fountain', 'CT Spawn / Hostage Zone'],
        ct_strategy: 'Window control denies T info on mid and rescue routes. Two CTs can hold the hostagezone entrance from market while one pressures kitchen.',
        t_strategy: 'Ts can hold from balcony and window angles to deny CT advances. Aggressive pushes through kitchen can flank CTs moving up mid. Isolate CT players from each other to win duels.',
        stats: { popularity: '#13', sites: 'Hostage Rescue', release: '1999' }
    },
    {
        id: 'de_tuscan',
        name: 'Tuscan',
        abbr: 'TSC',
        setting: 'Tuscany, Italy',
        type: 'Bomb Defusal',
        difficulty: 2,
        accent: '#c0392b',
        setting_detail: 'Rolling Tuscan hills and an old hilltop town.',
        description: 'Tuscan is a beloved community map that was a staple of competitive play before returning to CS2. It features a clean layout with clear callouts and a healthy balance between T and CT sides. Mid control through the main pass is the key strategic battleground each round.',
        callouts: ['A Main / A Site / Long / Short', 'Mid / Mid Lane / Passage', 'B Main / B Site / Back Alley', 'CT / CT Middle'],
        ct_strategy: 'Establishing mid presence early with a rifle creates crossfire opportunities. A long hold with an AWP is powerful. Saving utility for retakes is important as Ts execute efficiently.',
        t_strategy: 'Mid is the gateway to both sites on Tuscan. Winning mid allows the Ts to split A or rotate to B. A main with utility support is a default opening that puts CTs under immediate pressure.',
        stats: { popularity: '#14', sites: '2 (A, B)', release: '2023' }
    },
    {
        id: 'de_facade',
        name: 'Facade',
        abbr: 'FAC',
        setting: 'Eastern European City',
        type: 'Bomb Defusal',
        difficulty: 2,
        accent: '#00bcd4',
        setting_detail: 'A modern European cityscape with plazas, alleys, and rooftops.',
        description: 'Facade is one of the newer additions to the competitive CS2 pool. The map has an elegant design with layered urban architecture and a central plaza that divides the map into two strategic halves. It rewards teams who master utility and off-angle play.',
        callouts: ['A Site / Plaza / A Stairs', 'Mid / Mid Alley / Crossroads', 'B Site / B Lane / B Alley', 'CT / CT Plaza / Back Door'],
        ct_strategy: 'Plaza control is crucial. Hold CT side of mid alley to limit T movement. A passive CT anchor at B alley gathering information before rotating is a strong approach.',
        t_strategy: 'Opening Plaza with a crossfire from two angles forces CTs to over-commit. A and B sites are accessible from mid once Plaza is cleared. Utility is key on Facade — smokes on CT positions open sites efficiently.',
        stats: { popularity: '#15', sites: '2 (A, B)', release: '2024' }
    },
    {
        id: 'de_aztec',
        name: 'Aztec',
        abbr: 'AZT',
        setting: 'Mesoamerican Jungle Temple',
        type: 'Bomb Defusal',
        difficulty: 1,
        accent: '#27ae60',
        setting_detail: 'A dense jungle surrounding ancient Aztec temple ruins.',
        description: 'Aztec is one of the oldest maps in Counter-Strike, dating back to the original 1.6 era. Set in a lush jungle filled with Aztec ruins, it features a central bridge over a river that acts as the primary contested zone. The map is beginner-friendly and perfect for learning core CS mechanics.',
        callouts: ['Bridge / River / Steps / Jungle', 'A Site / CT Boost / Steps', 'B Site / Cave / Tomb', 'CT / CT Ramp / Water'],
        ct_strategy: 'Bridge control with a rifle or AWP establishes map dominance. One player can hold B cave entrance from CT while two stack A steps. Water area is rarely contested but can be used for a surprise flank.',
        t_strategy: 'Taking bridge control grants mid-map dominance and allows Ts to apply pressure on both sites. Cave rush to B is fast but predictable. Jungle flank after bridge control opens up a silent A approach.',
        stats: { popularity: '#16', sites: '2 (A, B)', release: '1999' }
    }
];

// ─── STATE ──────────────────────────────────────────────────────────────────

const state = {
    currentView: 'home',  // 'home' | 'maps' | 'map-detail'
    selectedMap: null
};

// ─── VIEW SWITCHER ───────────────────────────────────────────────────────────

function switchView(targetView) {
    const views = {
        home: document.getElementById('view-home'),
        maps: document.getElementById('view-maps'),
        'map-detail': document.getElementById('view-map-detail')
    };
    const navHome = document.getElementById('nav-home');
    const navMaps = document.getElementById('nav-maps');

    // Deactivate all
    Object.values(views).forEach(v => { if (v) { v.classList.remove('active'); } });
    navHome.classList.remove('active');
    navMaps.classList.remove('active');

    // Activate target
    if (views[targetView]) {
        views[targetView].classList.add('active');
    }

    if (targetView === 'home')       { navHome.classList.add('active'); }
    if (targetView === 'maps')       { navMaps.classList.add('active'); }
    if (targetView === 'map-detail') { navMaps.classList.add('active'); }

    state.currentView = targetView;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── MAP GRID BUILDER ────────────────────────────────────────────────────────

function buildDifficultyDots(level) {
    // level: 1=Easy, 2=Medium, 3=Hard
    return [1, 2, 3].map(i => `<span class="diff-dot${i <= level ? ' filled' : ''}"></span>`).join('');
}

function buildMapGrid() {
    const container = document.getElementById('maps-grid-container');
    if (!container) return;

    container.innerHTML = MAPS.map((map, index) => `
        <div class="map-card"
             id="map-card-${map.id}"
             style="--map-accent: ${map.accent};"
             data-map-id="${map.id}"
             role="button"
             tabindex="0"
             aria-label="Open ${map.name} details">
            <div class="map-card-icon">
                <span class="map-type-badge">${map.type === 'Bomb Defusal' ? 'DEFUSAL' : 'HOSTAGE'}</span>
                <div class="map-icon-emblem">${map.abbr}</div>
            </div>
            <div class="map-card-info">
                <span class="map-card-prefix">${map.id.toUpperCase()}</span>
                <h3 class="map-card-name">${map.name}</h3>
                <p class="map-card-setting">${map.setting}</p>
                <div class="map-card-footer">
                    <div class="map-difficulty">
                        <span class="diff-label">SKILL</span>
                        <div class="diff-dots">${buildDifficultyDots(map.difficulty)}</div>
                    </div>
                    <span class="map-enter-arrow">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    `).join('');

    // Attach click & keyboard handlers for each card
    MAPS.forEach(map => {
        const card = document.getElementById(`map-card-${map.id}`);
        if (card) {
            card.addEventListener('click', () => { window.location.hash = `map-${map.id}`; });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.hash = `map-${map.id}`; }
            });
        }
    });
}

// ─── MAP DETAIL PAGE ─────────────────────────────────────────────────────────

function diffClass(level) {
    return level === 1 ? 'badge-diff-easy' : level === 2 ? 'badge-diff-medium' : 'badge-diff-hard';
}
function diffLabel(level) {
    return level === 1 ? 'BEGINNER' : level === 2 ? 'INTERMEDIATE' : 'ADVANCED';
}

function openMapDetail(mapId) {
    const map = MAPS.find(m => m.id === mapId);
    if (!map) return;
    state.selectedMap = map;

    const content = document.getElementById('map-detail-content');
    if (!content) return;

    content.style.setProperty('--map-accent', map.accent);

    // ── helpers ─────────────────────────────────────────────────────────────
    const typeClass = t => ({ Smoke: 'type-smoke', Flash: 'type-flash', Molotov: 'type-molotov' }[t] || 'type-smoke');

    // ── radar image block ────────────────────────────────────────────────────
    const radarHTML = map.image ? `
        <div class="map-radar-panel">
            <div class="map-radar-panel-header">
                <h2 class="section-title">MAP OVERVIEW</h2>
                <span class="map-radar-panel-label">OVERHEAD RADAR</span>
            </div>
            <div class="map-radar-img-wrap">
                <img class="map-radar-img" src="${map.image}" alt="${map.name} radar overview" loading="lazy">
            </div>
        </div>` : '';

    // ── callout zones block ──────────────────────────────────────────────────
    const calloutsHTML = map.detailedCallouts ? `
        <div class="detail-section-card" style="grid-column: 1 / -1;">
            <h2 class="section-title">CALLOUT MAP</h2>
            <div class="callout-zones-grid">
                ${Object.entries(map.detailedCallouts).map(([zone, tags]) => `
                    <div class="callout-zone">
                        <div class="callout-zone-title">${zone}</div>
                        <div class="callout-tags">
                            ${tags.map(t => `<span class="callout-tag">${t}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>` : `
        <div class="detail-section-card">
            <h2 class="section-title">KEY CALLOUTS</h2>
            <ul class="callout-list">
                ${map.callouts.map(c => `<li>${c}</li>`).join('')}
            </ul>
        </div>`;

    // ── lineups table block ──────────────────────────────────────────────────
    const lineupsHTML = map.lineups ? `
        <div class="detail-section-card" style="grid-column: 1 / -1;">
            <h2 class="section-title">UTILITY LINEUPS</h2>
            <div class="lineup-table-wrap">
                <table class="lineup-table">
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>TYPE</th>
                            <th>THROW</th>
                            <th>POSITION</th>
                            <th>DESCRIPTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${map.lineups.map(l => `
                            <tr>
                                <td class="lineup-name">${l.name}</td>
                                <td><span class="lineup-type-badge ${typeClass(l.type)}">${l.type.toUpperCase()}</span></td>
                                <td><span class="throw-badge">${l.throwType}</span></td>
                                <td>${l.position}</td>
                                <td>${l.description}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>` : `
        <div class="coming-soon-banner" style="grid-column: 1 / -1;">
            <span class="coming-soon-icon">⚡</span>
            <div class="coming-soon-text">
                <strong>UTILITY LINEUPS — COMING SOON</strong>
                <span>Precise smoke, flash, and molotov lineups for ${map.name} are being developed and will be published soon.</span>
            </div>
        </div>`;

    // ── local video guides block ─────────────────────────────────────────────
    const videosHTML = (() => {
        const vids = map.localVideos;
        if (!vids || !vids.length) return '';

        // Group by category, preserving order
        const grouped = {};
        vids.forEach(v => {
            if (!grouped[v.category]) grouped[v.category] = [];
            grouped[v.category].push(v);
        });

        const categoryAccentMap = {
            'A SITE': '#e84545',
            'MID':    '#f0c040',
            'B SITE': '#4a9eff',
        };

        const categorySections = Object.entries(grouped).map(([cat, catVids]) => {
            const catAccent = categoryAccentMap[cat] || map.accent;
            const videoCards = catVids.map(v => `
                <div class="video-card">
                    <div class="video-card-label">
                        <span class="video-card-icon" style="background-color:${catAccent};"></span>
                        <span class="video-card-title">${v.title}</span>
                    </div>
                    <video class="local-video-player" controls preload="none">
                        <source src="${v.file}" type="video/mp4">
                        Your browser does not support HTML5 video.
                    </video>
                </div>
            `).join('');
            return `
                <div class="video-category-block">
                    <div class="video-category-header" style="--cat-accent: ${catAccent};">
                        <span class="video-category-label">${cat}</span>
                        <span class="video-category-count">${catVids.length} CLIPS</span>
                    </div>
                    <div class="videos-grid">${videoCards}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="videos-section">
                <h2 class="section-title">VIDEO GUIDES</h2>
                ${categorySections}
            </div>`;
    })();


    // ── assemble ─────────────────────────────────────────────────────────────
    content.innerHTML = `
        <!-- Hero Row -->
        <div class="detail-hero">
            <div class="detail-icon-panel">
                <div class="detail-icon-emblem">${map.abbr}</div>
                <span class="detail-map-prefix">${map.id.toUpperCase()}</span>
                <div class="detail-badges">
                    <span class="detail-badge badge-type">${map.type.toUpperCase()}</span>
                    <span class="detail-badge ${diffClass(map.difficulty)}">${diffLabel(map.difficulty)}</span>
                </div>
            </div>
            <div class="detail-info-panel">
                <div>
                    <h1 class="detail-map-name">${map.name.toUpperCase()}</h1>
                    <p class="detail-map-setting">${map.setting_detail}</p>
                </div>
                <p class="detail-description">${map.description}</p>
                <div class="detail-stats">
                    <div class="stat-box">
                        <div class="stat-box-val">${map.stats.popularity}</div>
                        <div class="stat-box-lbl">POPULARITY</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-box-val">${map.stats.sites}</div>
                        <div class="stat-box-lbl">OBJECTIVE</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-box-val">${map.stats.release}</div>
                        <div class="stat-box-lbl">RELEASED</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Radar Overview (Dust2 & Mirage only) -->
        ${radarHTML}

        <!-- Strategies + Callouts + Lineups -->
        <div class="detail-sections">
            <div class="detail-section-card">
                <h2 class="section-title">CT STRATEGY</h2>
                <p class="strategy-text">${map.ct_strategy}</p>
            </div>
            <div class="detail-section-card">
                <h2 class="section-title">T STRATEGY</h2>
                <p class="strategy-text">${map.t_strategy}</p>
            </div>


            <!-- Callout zones (full-width) -->
            ${calloutsHTML}
            <!-- Lineups table (full-width) -->
            ${lineupsHTML}
        </div>

        <!-- YouTube Video Guides (Mirage only) -->
        ${videosHTML}

        <!-- Custom Lineups added by you -->
        <div id="custom-lineups-section" style="margin-top: 30px; padding: 20px; background: #111; border: 1px solid #333;">
            <h2 style="color: #e8a045; font-family: Rajdhani, sans-serif; letter-spacing: 2px; margin-bottom: 15px;">MY LINEUPS</h2>
            <div id="custom-lineups-list"></div>
            <button id="add-lineup-btn" style="margin-top: 15px; padding: 10px 20px; background: #e8a045; color: #000; font-weight: bold; font-size: 14px; border: none; cursor: pointer;">+ ADD LINEUP</button>
        </div>
    `;

    // Show any lineups already saved for this map
    showSavedLineups(map.id);

    // When the button is clicked, open the add form
    document.getElementById('add-lineup-btn').addEventListener('click', function() {
        addLineup(map.id);
    });

    switchView('map-detail');
}


// ─── CUSTOM LINEUPS (saved in browser) ──────────────────────────────────────

// Read saved lineups for a map from server using server.get
async function getSavedLineups(mapId) {
    try {
        var res = await fetch('http://localhost:3000/api/lineups/' + mapId);
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error("Error loading lineups from server", e);
    }
    return [];
}

// Show the saved lineups in a simple table
async function showSavedLineups(mapId) {
    var lineups = await getSavedLineups(mapId);
    var container = document.getElementById('custom-lineups-list');
    if (!container) return;

    if (lineups.length === 0) {
        container.innerHTML = '<p style="color: #888;">No lineups added yet. Click the button below to add one!</p>';
        return;
    }

    var rows = '';
    for (var i = 0; i < lineups.length; i++) {
        var l = lineups[i];
        rows += '<tr>' +
            '<td style="padding: 8px; border-bottom: 1px solid #333; color: #fff;">' + l.name + '</td>' +
            '<td style="padding: 8px; border-bottom: 1px solid #333; color: #e8a045;">' + l.type + '</td>' +
            '<td style="padding: 8px; border-bottom: 1px solid #333; color: #aaa;">' + l.position + '</td>' +
            '<td style="padding: 8px; border-bottom: 1px solid #333; color: #aaa;">' + l.description + '</td>' +
            '<td style="padding: 8px; border-bottom: 1px solid #333;">' +
                '<button onclick="deleteLineup(\'' + mapId + '\', ' + i + ')" style="background: #c0392b; color: #fff; border: none; padding: 4px 10px; cursor: pointer;">Delete</button>' +
            '</td>' +
        '</tr>';
    }

    container.innerHTML = '<table style="width: 100%; border-collapse: collapse; color: #ccc;">' +
        '<thead><tr style="color: #e8a045; text-align: left;">' +
        '<th style="padding: 8px;">NAME</th>' +
        '<th style="padding: 8px;">TYPE</th>' +
        '<th style="padding: 8px;">POSITION</th>' +
        '<th style="padding: 8px;">DESCRIPTION</th>' +
        '<th style="padding: 8px;"></th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>';
}

// Show a simple form to add a new lineup
async function addLineup(mapId) {
    var name        = window.prompt('Lineup name (e.g. "CT Smoke"):');
    if (!name) return; // user pressed cancel

    var type        = window.prompt('Type (Smoke / Flash / Molotov):');
    if (!type) return;

    var position    = window.prompt('Throw position (where you stand):');
    if (!position) return;

    var description = window.prompt('Description (what it does):');
    if (!description) return;

    // Send the lineup to the backend using GET query parameters (server.get)
    try {
        var url = 'http://localhost:3000/api/lineups/' + mapId + '/add' +
            '?name=' + encodeURIComponent(name) +
            '&type=' + encodeURIComponent(type) +
            '&position=' + encodeURIComponent(position) +
            '&description=' + encodeURIComponent(description);
        
        await fetch(url);
    } catch (e) {
        console.error("Error adding lineup to server", e);
    }

    // Refresh the list on screen
    await showSavedLineups(mapId);
}

// Delete one lineup by its position in the list
async function deleteLineup(mapId, index) {
    try {
        await fetch('http://localhost:3000/api/lineups/' + mapId + '/delete/' + index);
    } catch (e) {
        console.error("Error deleting lineup from server", e);
    }
    await showSavedLineups(mapId);
}

// ─── NAVIGATION SETUP ────────────────────────────────────────────────────────

function setupNavigation() {
    document.getElementById('nav-home')?.addEventListener('click', () => { window.location.hash = 'home'; });
    document.getElementById('nav-maps')?.addEventListener('click', () => { window.location.hash = 'maps'; });
    document.getElementById('logo-btn')?.addEventListener('click', () => { window.location.hash = 'home'; });
    document.getElementById('choose-map-btn')?.addEventListener('click', () => { window.location.hash = 'maps'; });
    document.getElementById('back-to-home-btn')?.addEventListener('click', () => { window.location.hash = 'home'; });
    document.getElementById('back-to-maps-btn')?.addEventListener('click', () => { window.location.hash = 'maps'; });
}

// ─── ROUTER ──────────────────────────────────────────────────────────────────

function handleRouting() {
    const hash = window.location.hash;
    if (hash === '' || hash === '#home') {
        switchView('home');
    } else if (hash === '#maps') {
        switchView('maps');
    } else if (hash.startsWith('#map-')) {
        const mapId = hash.replace('#map-', '');
        openMapDetail(mapId);
    } else {
        switchView('home');
    }
}

// ─── INIT ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    buildMapGrid();
    setupNavigation();
    window.addEventListener('hashchange', handleRouting);
    handleRouting();
    if (typeof AuthUI !== 'undefined') {
        AuthUI.init();
    }
    console.log('%c[TACTICAL SECURE CHANNEL] // CS Tactical Hub Initialized. 16 maps loaded.', 'color: #00ff66; font-weight: bold;');
});

// ─── ADD INFO FORM ─────────────────────────────────────────────────────────

function submitInfo() {
    var mapName = document.getElementById('input-map-name').value;
    var info = document.getElementById('input-info').value;

    if (mapName == '' || info == '') {
        alert('Please fill in all fields!');
        return;
    }

    alert('Info saved for: ' + mapName);
    document.getElementById('add-info-form').style.display = 'none';
    document.getElementById('input-map-name').value = '';
    document.getElementById('input-info').value = '';
}
