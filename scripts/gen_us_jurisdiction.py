# Generate usJurisdiction.ts
from pathlib import Path
import json

STATES = [
("AL","Alabama",32.806671,-86.791130),
("AK","Alaska",61.370716,-152.404419),
("AZ","Arizona",33.729759,-111.431221),
("AR","Arkansas",34.969704,-92.373123),
("CA","California",36.116203,-119.681564),
("CO","Colorado",39.059811,-105.311104),
("CT","Connecticut",41.597782,-72.755371),
("DE","Delaware",39.318523,-75.507141),
("FL","Florida",27.766279,-81.686783),
("GA","Georgia",33.040619,-83.643074),
("HI","Hawaii",21.094318,-157.498337),
("ID","Idaho",44.240459,-114.478828),
("IL","Illinois",40.349457,-88.986137),
("IN","Indiana",39.849426,-86.258278),
("IA","Iowa",42.011539,-93.210526),
("KS","Kansas",38.526600,-96.726486),
("KY","Kentucky",37.668140,-84.670067),
("LA","Louisiana",31.169546,-91.867805),
("ME","Maine",44.693947,-69.381927),
("MD","Maryland",39.063946,-76.802101),
("MA","Massachusetts",42.230171,-71.530106),
("MI","Michigan",43.326618,-84.536095),
("MN","Minnesota",45.694454,-93.900192),
("MS","Mississippi",32.741646,-89.678696),
("MO","Missouri",38.456085,-92.288368),
("MT","Montana",46.921925,-110.454353),
("NE","Nebraska",41.125370,-98.268082),
("NV","Nevada",38.313515,-117.055374),
("NH","New Hampshire",43.452492,-71.563896),
("NJ","New Jersey",40.298904,-74.521011),
("NM","New Mexico",34.840515,-106.248482),
("NY","New York",42.165726,-74.948051),
("NC","North Carolina",35.630066,-79.806419),
("ND","North Dakota",47.528912,-99.784012),
("OH","Ohio",40.388783,-82.764915),
("OK","Oklahoma",35.565342,-96.928917),
("OR","Oregon",44.572021,-122.070938),
("PA","Pennsylvania",40.590752,-77.209755),
("RI","Rhode Island",41.680893,-71.51178),
("SC","South Carolina",33.856892,-80.945007),
("SD","South Dakota",44.299782,-99.438828),
("TN","Tennessee",35.747845,-86.692345),
("TX","Texas",31.054487,-97.563461),
("UT","Utah",40.150032,-111.862434),
("VT","Vermont",44.045876,-72.710686),
("VA","Virginia",37.769337,-78.169968),
("WA","Washington",47.400902,-121.490494),
("WV","West Virginia",38.491226,-80.954453),
("WI","Wisconsin",44.268543,-89.616508),
("WY","Wyoming",42.755966,-107.30249),
]

CITIES = {
"AL":[("birmingham","Birmingham",33.5207,-86.8025),("montgomery","Montgomery",32.3668,-86.3000),("huntsville","Huntsville",34.7304,-86.5861),("mobile","Mobile",30.6954,-88.0399)],
"AK":[("anchorage","Anchorage",61.2181,-149.9003),("fairbanks","Fairbanks",64.8378,-147.7164),("juneau","Juneau",58.3019,-134.4197)],
"AZ":[("phoenix","Phoenix",33.4484,-112.0740),("tucson","Tucson",32.2226,-110.9747),("mesa","Mesa",33.4152,-111.8315),("scottsdale","Scottsdale",33.4942,-111.9261),("chandler","Chandler",33.3062,-111.8413)],
"AR":[("little-rock","Little Rock",34.7465,-92.2896),("fayetteville","Fayetteville",36.0626,-94.1574),("fort-smith","Fort Smith",35.3859,-94.3985)],
"CA":[("los-angeles","Los Angeles",34.0522,-118.2437),("san-francisco","San Francisco",37.7749,-122.4194),("san-diego","San Diego",32.7157,-117.1611),("san-jose","San Jose",37.3382,-121.8863),("sacramento","Sacramento",38.5816,-121.4944),("oakland","Oakland",37.8044,-122.2712),("fresno","Fresno",36.7378,-119.7871)],
"CO":[("denver","Denver",39.7392,-104.9903),("colorado-springs","Colorado Springs",38.8339,-104.8214),("aurora","Aurora",39.7294,-104.8319),("fort-collins","Fort Collins",40.5853,-105.0844)],
"CT":[("bridgeport","Bridgeport",41.1865,-73.1952),("new-haven","New Haven",41.3083,-72.9279),("hartford","Hartford",41.7658,-72.6734),("stamford","Stamford",41.0534,-73.5387)],
"DE":[("wilmington","Wilmington",39.7391,-75.5398),("dover","Dover",39.1582,-75.5244),("newark","Newark",39.6837,-75.7497)],
"FL":[("miami","Miami",25.7617,-80.1918),("tampa","Tampa",27.9506,-82.4572),("orlando","Orlando",28.5383,-81.3792),("jacksonville","Jacksonville",30.3322,-81.6557),("tallahassee","Tallahassee",30.4383,-84.2807),("st-petersburg","St. Petersburg",27.7676,-82.6403)],
"GA":[("atlanta","Atlanta",33.7490,-84.3880),("savannah","Savannah",32.0809,-81.0912),("augusta","Augusta",33.4735,-82.0105),("columbus","Columbus",32.4610,-84.9877),("macon","Macon",32.8407,-83.6324)],
"HI":[("honolulu","Honolulu",21.3069,-157.8583),("hilo","Hilo",19.7074,-155.0885),("kailua","Kailua",21.4022,-157.7394)],
"ID":[("boise","Boise",43.6150,-116.2023),("meridian","Meridian",43.6121,-116.3915),("nampa","Nampa",43.5407,-116.5635)],
"IL":[("chicago","Chicago",41.8781,-87.6298),("aurora","Aurora",41.7606,-88.3201),("naperville","Naperville",41.7508,-88.1535),("springfield","Springfield",39.7817,-89.6501),("peoria","Peoria",40.6936,-89.5890)],
"IN":[("indianapolis","Indianapolis",39.7684,-86.1581),("fort-wayne","Fort Wayne",41.0793,-85.1394),("evansville","Evansville",37.9716,-87.5711),("south-bend","South Bend",41.6764,-86.2520)],
"IA":[("des-moines","Des Moines",41.5868,-93.6250),("cedar-rapids","Cedar Rapids",41.9778,-91.6656),("davenport","Davenport",41.5236,-90.5776)],
"KS":[("wichita","Wichita",37.6872,-97.3301),("overland-park","Overland Park",38.9822,-94.6708),("kansas-city","Kansas City",39.1142,-94.6275),("topeka","Topeka",39.0473,-95.6752)],
"KY":[("louisville","Louisville",38.2527,-85.7585),("lexington","Lexington",38.0406,-84.5037),("bowling-green","Bowling Green",36.9685,-86.4808)],
"LA":[("new-orleans","New Orleans",29.9511,-90.0715),("baton-rouge","Baton Rouge",30.4515,-91.1871),("shreveport","Shreveport",32.5252,-93.7502),("lafayette","Lafayette",30.2241,-92.0198)],
"ME":[("portland","Portland",43.6591,-70.2568),("lewiston","Lewiston",44.1004,-70.2148),("bangor","Bangor",44.8012,-68.7778)],
"MD":[("baltimore","Baltimore",39.2904,-76.6122),("frederick","Frederick",39.4143,-77.4105),("rockville","Rockville",39.083997,-77.15276),("annapolis","Annapolis",38.9784,-76.4922)],
"MA":[("boston","Boston",42.3601,-71.0589),("worcester","Worcester",42.2626,-71.8023),("springfield","Springfield",42.1015,-72.5898),("cambridge","Cambridge",42.3736,-71.1097)],
"MI":[("detroit","Detroit",42.3314,-83.0458),("grand-rapids","Grand Rapids",42.9634,-85.6681),("warren","Warren",42.5145,-83.0147),("ann-arbor","Ann Arbor",42.2808,-83.7430),("lansing","Lansing",42.7325,-84.5555)],
"MN":[("minneapolis","Minneapolis",44.9778,-93.2650),("saint-paul","Saint Paul",44.9537,-93.0900),("rochester","Rochester",44.0121,-92.4802),("duluth","Duluth",46.7867,-92.1005)],
"MS":[("jackson","Jackson",32.2988,-90.1848),("gulfport","Gulfport",30.3674,-89.0928),("southaven","Southaven",34.9889,-90.0126)],
"MO":[("kansas-city","Kansas City",39.0997,-94.5786),("saint-louis","St. Louis",38.6270,-90.1994),("springfield","Springfield",37.2090,-93.2923),("columbia","Columbia",38.9517,-92.3341)],
"MT":[("billings","Billings",45.7833,-108.5007),("missoula","Missoula",46.8721,-113.9940),("great-falls","Great Falls",47.5053,-111.3008),("helena","Helena",46.5891,-112.0391)],
"NE":[("omaha","Omaha",41.2565,-95.9345),("lincoln","Lincoln",40.8136,-96.7026),("bellevue","Bellevue",41.1544,-95.9146)],
"NV":[("las-vegas","Las Vegas",36.1699,-115.1398),("henderson","Henderson",36.0395,-114.9817),("reno","Reno",39.5296,-119.8138),("north-las-vegas","North Las Vegas",36.1989,-115.1175)],
"NH":[("manchester","Manchester",42.9956,-71.4548),("nashua","Nashua",42.7654,-71.4676),("concord","Concord",43.2081,-71.5376)],
"NJ":[("newark","Newark",40.7357,-74.1724),("jersey-city","Jersey City",40.7178,-74.0431),("paterson","Paterson",40.9168,-74.1718),("trenton","Trenton",40.2206,-74.7597),("atlantic-city","Atlantic City",39.3643,-74.4229)],
"NM":[("albuquerque","Albuquerque",35.0844,-106.6504),("las-cruces","Las Cruces",32.3199,-106.7637),("rio-rancho","Rio Rancho",35.2328,-106.6630),("santa-fe","Santa Fe",35.6870,-105.9378)],
"NY":[("new-york","New York City",40.7128,-74.0060),("buffalo","Buffalo",42.8864,-78.8784),("rochester","Rochester",43.1566,-77.6088),("yonkers","Yonkers",40.9312,-73.8988),("albany","Albany",42.6526,-73.7562),("syracuse","Syracuse",43.0481,-76.1474)],
"NC":[("charlotte","Charlotte",35.2271,-80.8431),("raleigh","Raleigh",35.7796,-78.6382),("greensboro","Greensboro",36.0726,-79.7920),("durham","Durham",35.9940,-78.8986),("winston-salem","Winston-Salem",36.0999,-80.2442)],
"ND":[("fargo","Fargo",46.8772,-96.7898),("bismarck","Bismarck",46.8083,-100.7837),("grand-forks","Grand Forks",47.9253,-97.0329)],
"OH":[("columbus","Columbus",39.9612,-82.9988),("cleveland","Cleveland",41.4993,-81.6944),("cincinnati","Cincinnati",39.1031,-84.5120),("toledo","Toledo",41.6528,-83.5379),("akron","Akron",41.0814,-81.5190)],
"OK":[("oklahoma-city","Oklahoma City",35.4676,-97.5164),("tulsa","Tulsa",36.1540,-95.9928),("norman","Norman",35.2226,-97.4395)],
"OR":[("portland","Portland",45.5152,-122.6784),("salem","Salem",44.9429,-123.0351),("eugene","Eugene",44.0521,-123.0868),("gresham","Gresham",45.5001,-122.4302)],
"PA":[("philadelphia","Philadelphia",39.9526,-75.1652),("pittsburgh","Pittsburgh",40.4406,-79.9959),("allentown","Allentown",40.6084,-75.4902),("harrisburg","Harrisburg",40.2732,-76.8867),("erie","Erie",42.1292,-80.0851)],
"RI":[("providence","Providence",41.8240,-71.4128),("warwick","Warwick",41.7001,-71.4162),("cranston","Cranston",41.7798,-71.4373)],
"SC":[("charleston","Charleston",32.7765,-79.9311),("columbia","Columbia",34.0007,-81.0348),("north-charleston","North Charleston",32.8546,-79.9748),("greenville","Greenville",34.8526,-82.3940)],
"SD":[("sioux-falls","Sioux Falls",43.5446,-96.7311),("rapid-city","Rapid City",44.0805,-103.2310),("aberdeen","Aberdeen",45.4647,-98.4865)],
"TN":[("nashville","Nashville",36.1627,-86.7816),("memphis","Memphis",35.1495,-90.0490),("knoxville","Knoxville",35.9606,-83.9207),("chattanooga","Chattanooga",35.0456,-85.3097)],
"TX":[("houston","Houston",29.7604,-95.3698),("san-antonio","San Antonio",29.4241,-98.4936),("dallas","Dallas",32.7767,-96.7970),("austin","Austin",30.2672,-97.7431),("fort-worth","Fort Worth",32.7555,-97.3308),("el-paso","El Paso",31.7619,-106.4850)],
"UT":[("salt-lake-city","Salt Lake City",40.7608,-111.8910),("west-valley-city","West Valley City",40.6916,-112.0011),("provo","Provo",40.2338,-111.6585),("west-jordan","West Jordan",40.6097,-111.9391)],
"VT":[("burlington","Burlington",44.4759,-73.2121),("south-burlington","South Burlington",44.4669,-73.1709),("montpelier","Montpelier",44.2601,-72.5754)],
"VA":[("virginia-beach","Virginia Beach",36.8529,-75.9780),("norfolk","Norfolk",36.8508,-76.2859),("chesapeake","Chesapeake",36.7682,-76.2875),("richmond","Richmond",37.5407,-77.4360),("arlington","Arlington",38.8816,-77.0910)],
"WA":[("seattle","Seattle",47.6062,-122.3321),("spokane","Spokane",47.6588,-117.4260),("tacoma","Tacoma",47.2529,-122.4443),("vancouver","Vancouver",45.6387,-122.6615),("bellevue","Bellevue",47.6101,-122.2015)],
"WV":[("charleston","Charleston",38.3498,-81.6326),("huntington","Huntington",38.4192,-82.4452),("morgantown","Morgantown",39.6295,-79.9559)],
"WI":[("milwaukee","Milwaukee",43.0389,-87.9065),("madison","Madison",43.0731,-89.4012),("green-bay","Green Bay",44.5133,-88.0133),("kenosha","Kenosha",42.5847,-87.8212)],
"WY":[("cheyenne","Cheyenne",41.1400,-104.8202),("casper","Casper",42.8666,-106.3131),("laramie","Laramie",41.3114,-105.5911)],
}

assert set(CITIES) == {s[0] for s in STATES}
assert len(STATES) == 50

lines = []
lines += [
'/**',
' * US states + major cities for jurisdiction picker + Deflock bbox targeting.',
' * Cities dropdown is gated on an actively selected state.',
' * Coordinates are public centroids — not survey monuments.',
' */',
'',
"import type { DeflockBBox } from '../types/deflock'",
'',
'export interface UsCity {',
'  id: string',
'  name: string',
'  stateCode: string',
'  lat: number',
'  lng: number',
'  /** Approximate metro box half-width (degrees) for Overpass/Deflock */',
'  deflockDeltaDeg: number',
'}',
'',
'export interface UsStateMeta {',
'  stateCode: string',
'  stateName: string',
'  lat: number',
'  lng: number',
'  /** Wider box half-width for state-level density scan */',
'  deflockDeltaDeg: number',
'}',
'',
'export const US_STATES_META: UsStateMeta[] = [',
]
for code, name, lat, lng in STATES:
    if code in ('AK', 'TX', 'CA', 'MT'):
        d = 2.5
    elif code in ('AZ', 'NV', 'CO', 'NM', 'WY', 'OR', 'WA', 'ID'):
        d = 1.6
    else:
        d = 1.1
    lines.append(
        f"  {{ stateCode: '{code}', stateName: '{name}', lat: {lat}, lng: {lng}, deflockDeltaDeg: {d} }},"
    )
lines.append(']')
lines.append('')
lines.append('export const US_CITIES: UsCity[] = [')
n = 0
for code, _, __, ___ in STATES:
    for cid, name, lat, lng in CITIES[code]:
        d = 0.22 if name in (
            'New York City', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
        ) else 0.16
        lines.append(
            f"  {{ id: '{code.lower()}-{cid}', name: {json.dumps(name)}, stateCode: '{code}', lat: {lat}, lng: {lng}, deflockDeltaDeg: {d} }},"
        )
        n += 1
lines.append(']')
lines += [
'',
'export function listAllStates(): UsStateMeta[] {',
'  return US_STATES_META',
'}',
'',
'export function citiesForState(stateCode: string | null | undefined): UsCity[] {',
'  if (!stateCode) return []',
'  const sc = stateCode.toUpperCase()',
'  return US_CITIES.filter((c) => c.stateCode === sc).sort((a, b) => a.name.localeCompare(b.name))',
'}',
'',
'export function getStateMeta(stateCode: string): UsStateMeta | undefined {',
'  return US_STATES_META.find((s) => s.stateCode === stateCode.toUpperCase())',
'}',
'',
'export function getCityById(id: string): UsCity | undefined {',
'  return US_CITIES.find((c) => c.id === id)',
'}',
'',
'export function bboxFromCenterDelta(lat: number, lng: number, delta: number, label: string): DeflockBBox {',
'  return {',
'    south: lat - delta,',
'    west: lng - delta,',
'    north: lat + delta,',
'    east: lng + delta,',
'    label,',
'  }',
'}',
'',
'export function bboxForState(stateCode: string): DeflockBBox | null {',
'  const s = getStateMeta(stateCode)',
'  if (!s) return null',
'  return bboxFromCenterDelta(s.lat, s.lng, s.deflockDeltaDeg, `${s.stateName} (state density scan)`)',
'}',
'',
'export function bboxForCity(cityId: string): DeflockBBox | null {',
'  const c = getCityById(cityId)',
'  if (!c) return null',
'  return bboxFromCenterDelta(c.lat, c.lng, c.deflockDeltaDeg, `${c.name}, ${c.stateCode} (Deflock / OSM)`)',
'}',
'',
f'// Generated: {n} cities across 50 states',
'',
]
path = Path(r'C:\Nexus\dev\src\data\usJurisdiction.ts')
path.write_text('\n'.join(lines), encoding='utf-8')
print('wrote', path, 'cities', n)
