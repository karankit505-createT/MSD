import React, { useState, useEffect, useLayoutEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import DigitalIdCard from "@/components/DigitalIdCard";
import { getApiUrl } from "@/config/api";
import {
  User,
  MapPin,
  Briefcase,
  ShieldCheck,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Printer,
  Download,
  Sparkles,
  AlertCircle,
  Clock,
  Heart,
  Phone,
  Mail,
  Scale,
  Stethoscope,
  GraduationCap,
  Trophy,
  UtensilsCrossed,
  Users,
  UserPlus,
  Search,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Crop,
  Trash2,
  Calendar,
  Edit3,
} from "lucide-react";
import { jsPDF } from "jspdf";
import ImageCropModal from "@/components/ImageCropModal";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const STATE_DISTRICTS: Record<string, string[]> = {
  Karnataka: [
    "Bagalkot",
    "Ballari",
    "Belagavi",
    "Bengaluru Rural",
    "Bengaluru Urban",
    "Bidar",
    "Chamarajanagar",
    "Chikkaballapur",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwad",
    "Gadag",
    "Hassan",
    "Haveri",
    "Kalaburagi",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru",
    "Raichur",
    "Ramanagara",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayapura",
    "Vijayanagara",
    "Yadgir",
    "Other District",
  ],
  "Tamil Nadu": [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Kanniyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
    "Other District",
  ],
  Telangana: [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hanamkonda",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Kumuram Bheem Asifabad",
    "Mahabubabad",
    "Mahabubnagar",
    "Mancherial",
    "Medak",
    "Medchal-Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Ranga Reddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri",
    "Other District",
  ],
  "Andhra Pradesh": [
    "Alluri Sitharama Raju",
    "Anakapalli",
    "Ananthapuramu",
    "Annamayya",
    "Bapatla",
    "Chittoor",
    "Dr. B.R. Ambedkar Konaseema",
    "East Godavari",
    "Eluru",
    "Guntur",
    "Kakinada",
    "Krishna",
    "Kurnool",
    "Nandyal",
    "NTR",
    "Palnadu",
    "Parvathipuram Manyam",
    "Prakasam",
    "Sri Potti Sriramulu Nellore",
    "Sri Sathya Sai",
    "Srikakulam",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "YSR Kadapa",
    "Other District",
  ],
  Jharkhand: [
    "Bokaro",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "East Singhbhum",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribagh",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Pakur",
    "Palamu",
    "Ramgarh",
    "Ranchi",
    "Sahebganj",
    "Seraikela Kharsawan",
    "Simdega",
    "West Singhbhum",
    "Other District",
  ],
  Maharashtra: [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Chhatrapati Sambhajinagar",
    "Dharashiv",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Nashik",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal",
    "Other District",
  ],
  Kerala: [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
    "Other District",
  ],
  Delhi: [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi",
    "Other District",
  ],
  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Ayodhya",
    "Azamgarh",
    "Bareilly",
    "Basti",
    "Bijnor",
    "Bulandshahr",
    "Chandauli",
    "Deoria",
    "Etah",
    "Etawah",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddha Nagar (Noida)",
    "Ghaziabad",
    "Gorakhpur",
    "Jhansi",
    "Kanpur Nagar",
    "Lucknow",
    "Mathura",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Prayagraj",
    "Raebareli",
    "Saharanpur",
    "Shahjahanpur",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi",
    "Other District",
  ],
  Bihar: [
    "Araria",
    "Arwal",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "East Champaran",
    "Gaya",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Lakhisarai",
    "Madhepura",
    "Madhubani",
    "Munger",
    "Muzaffarpur",
    "Nalanda",
    "Nawada",
    "Patna",
    "Purnia",
    "Rohtas",
    "Saharsa",
    "Samastipur",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali",
    "West Champaran",
    "Other District",
  ],
  Gujarat: [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udaipur",
    "Dahod",
    "Dang",
    "Devbhoomi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad",
    "Other District",
  ],
  Rajasthan: [
    "Ajmer",
    "Alwar",
    "Banswara",
    "Baran",
    "Barmer",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Bundi",
    "Chittorgarh",
    "Churu",
    "Dausa",
    "Dholpur",
    "Dungarpur",
    "Hanumangarh",
    "Jaipur",
    "Jaisalmer",
    "Jalore",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
    "Kota",
    "Nagaur",
    "Pali",
    "Pratapgarh",
    "Rajsamand",
    "Sawai Madhopur",
    "Sikar",
    "Sirohi",
    "Sri Ganganagar",
    "Tonk",
    "Udaipur",
    "Other District",
  ],
  Punjab: [
    "Amritsar",
    "Barnala",
    "Bathinda",
    "Faridkot",
    "Fatehgarh Sahib",
    "Fazilka",
    "Ferozepur",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Kapurthala",
    "Ludhiana",
    "Malerkotla",
    "Mansa",
    "Moga",
    "Muktsar",
    "Pathankot",
    "Patiala",
    "Rupnagar",
    "Sangrur",
    "SAS Nagar (Mohali)",
    "SBS Nagar",
    "Tarn Taran",
    "Other District",
  ],
  Haryana: [
    "Ambala",
    "Bhiwani",
    "Charkhi Dadri",
    "Faridabad",
    "Fatehabad",
    "Gurugram",
    "Hisar",
    "Jhajjar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Mahendragarh",
    "Nuh",
    "Palwal",
    "Panchkula",
    "Panipat",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
    "Yamunanagar",
    "Other District",
  ],
  Odisha: [
    "Angul",
    "Balangir",
    "Balasore",
    "Bargarh",
    "Bhadrak",
    "Boudh",
    "Cuttack",
    "Deogarh",
    "Dhenkanal",
    "Gajapati",
    "Ganjam",
    "Jagatsinghpur",
    "Jajpur",
    "Jharsuguda",
    "Kalahandi",
    "Kandhamal",
    "Kendrapara",
    "Kendujhar",
    "Khordha (Bhubaneswar)",
    "Koraput",
    "Malkangiri",
    "Mayurbhanj",
    "Nabarangpur",
    "Nayagarh",
    "Nuapada",
    "Puri",
    "Rayagada",
    "Sambalpur",
    "Subarnapur",
    "Sundargarh",
    "Other District",
  ],
  "West Bengal": [
    "Alipurduar",
    "Bankura",
    "Birbhum",
    "Cooch Behar",
    "Dakshin Dinajpur",
    "Darjeeling",
    "Hooghly",
    "Howrah",
    "Jalpaiguri",
    "Jhargram",
    "Kalimpong",
    "Kolkata",
    "Malda",
    "Murshidabad",
    "Nadia",
    "North 24 Parganas",
    "Paschim Bardhaman",
    "Paschim Medinipur",
    "Purba Bardhaman",
    "Purba Medinipur",
    "Purulia",
    "South 24 Parganas",
    "Uttar Dinajpur",
    "Other District",
  ],
  Assam: [
    "Baksa",
    "Barpeta",
    "Biswanath",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Hojai",
    "Jorhat",
    "Kamrup",
    "Kamrup Metropolitan (Guwahati)",
    "Karbi Anglong",
    "Karimganj",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "Tinsukia",
    "Udalguri",
    "Other District",
  ],
  "Madhya Pradesh": [
    "Agar Malwa",
    "Alirajpur",
    "Anuppur",
    "Ashoknagar",
    "Balaghat",
    "Barwani",
    "Betul",
    "Bhind",
    "Bhopal",
    "Burhanpur",
    "Chhatarpur",
    "Chhindwara",
    "Damoh",
    "Datia",
    "Dewas",
    "Dhar",
    "Dindori",
    "Guna",
    "Gwalior",
    "Harda",
    "Hoshangabad (Narmadapuram)",
    "Indore",
    "Jabalpur",
    "Jhabua",
    "Katni",
    "Khandwa",
    "Khargone",
    "Mandla",
    "Mandsaur",
    "Morena",
    "Narsinghpur",
    "Neemuch",
    "Panna",
    "Raisen",
    "Rajgarh",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Satna",
    "Sehore",
    "Seoni",
    "Shahdol",
    "Shajapur",
    "Sheopur",
    "Shivpuri",
    "Sidhi",
    "Singrauli",
    "Tikamgarh",
    "Ujjain",
    "Umaria",
    "Vidisha",
    "Other District",
  ],
  Chhattisgarh: [
    "Balod",
    "Baloda Bazar",
    "Balrampur",
    "Bastar (Jagdalpur)",
    "Bemetara",
    "Bijapur",
    "Bilaspur",
    "Dantewada",
    "Dhamtari",
    "Durg",
    "Gariaband",
    "Gaurela Pendra Marwahi",
    "Janjgir Champa",
    "Jashpur",
    "Kabirdham (Kawardha)",
    "Kanker",
    "Khairagarh",
    "Kondagaon",
    "Korba",
    "Koriya",
    "Mahasamund",
    "Manendragarh",
    "Mohla Manpur",
    "Mungeli",
    "Narayanpur",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sarangarh Bilaigarh",
    "Sakti",
    "Sukma",
    "Surajpur",
    "Surguja (Ambikapur)",
    "Other District",
  ],
  Uttarakhand: [
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi",
    "Other District",
  ],
  "Himachal Pradesh": [
    "Bilaspur",
    "Chamba",
    "Hamirpur",
    "Kangra (Dharamshala)",
    "Kinnaur",
    "Kullu",
    "Lahaul and Spiti",
    "Mandi",
    "Shimla",
    "Sirmaur",
    "Solan",
    "Una",
    "Other District",
  ],
  "Jammu and Kashmir": [
    "Anantnag",
    "Bandipora",
    "Baramulla",
    "Budgam",
    "Doda",
    "Ganderbal",
    "Jammu",
    "Kathua",
    "Kishtwar",
    "Kulgam",
    "Kupwara",
    "Poonch",
    "Pulwama",
    "Rajouri",
    "Ramban",
    "Reasi",
    "Samba",
    "Shopian",
    "Srinagar",
    "Udhampur",
    "Other District",
  ],
  Ladakh: ["Kargil", "Leh", "Other District"],
  Goa: ["North Goa", "South Goa", "Other District"],
  Manipur: [
    "Bishnupur",
    "Chandel",
    "Churachandpur",
    "Imphal East",
    "Imphal West",
    "Jiribam",
    "Kakching",
    "Kamjong",
    "Kangpokpi",
    "Noney",
    "Pherzawl",
    "Senapati",
    "Tamenglong",
    "Tengnoupal",
    "Thoubal",
    "Ukhrul",
    "Other District",
  ],
  Meghalaya: [
    "East Garo Hills",
    "East Jaintia Hills",
    "East Khasi Hills (Shillong)",
    "Eastern West Khasi Hills",
    "North Garo Hills",
    "Ri-Bhoi",
    "South Garo Hills",
    "South West Garo Hills",
    "South West Khasi Hills",
    "West Garo Hills",
    "West Jaintia Hills",
    "West Khasi Hills",
    "Other District",
  ],
  Mizoram: [
    "Aizawl",
    "Champhai",
    "Hnahthial",
    "Khawzawl",
    "Kolasib",
    "Lawngtlai",
    "Lunglei",
    "Mamit",
    "Saitual",
    "Serchhip",
    "Siaha",
    "Other District",
  ],
  Nagaland: [
    "Chumoukedima",
    "Dimapur",
    "Kiphire",
    "Kohima",
    "Longleng",
    "Mokokchung",
    "Mon",
    "Niuland",
    "Noklak",
    "Peren",
    "Phek",
    "Shamator",
    "Tseminyu",
    "Tuensang",
    "Wokha",
    "Zunheboto",
    "Other District",
  ],
  Tripura: [
    "Dhalai",
    "Gomati",
    "Khowai",
    "North Tripura",
    "Sepahijala",
    "South Tripura",
    "Unakoti",
    "West Tripura (Agartala)",
    "Other District",
  ],
  Sikkim: [
    "Gangtok",
    "Gyalshing",
    "Mangan",
    "Namchi",
    "Pakyong",
    "Soreng",
    "Other District",
  ],
  "Arunachal Pradesh": [
    "Anjaw",
    "Changlang",
    "Dibang Valley",
    "East Kameng",
    "East Siang",
    "Kamle",
    "Kra Daadi",
    "Kurung Kumey",
    "Lepa Rada",
    "Lohit",
    "Longding",
    "Lower Dibang Valley",
    "Lower Siang",
    "Lower Subansiri",
    "Namsai",
    "Pakke Kessang",
    "Papum Pare (Itanagar)",
    "Shi Yomi",
    "Siang",
    "Tawang",
    "Tirap",
    "Upper Siang",
    "Upper Subansiri",
    "West Kameng",
    "West Siang",
    "Other District",
  ],
  Chandigarh: ["Chandigarh", "Other District"],
  Puducherry: ["Karaikal", "Mahe", "Puducherry", "Yanam", "Other District"],
  "Andaman and Nicobar Islands": [
    "Nicobar",
    "North and Middle Andaman",
    "South Andaman (Port Blair)",
    "Other District",
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Dadra and Nagar Haveli",
    "Daman",
    "Diu",
    "Other District",
  ],
  Lakshadweep: [
    "Agatti",
    "Amini",
    "Andrott",
    "Kavaratti",
    "Minicoy",
    "Other District",
  ],
  Other: ["Other District"],
};

const WINGS = [
  {
    id: "Legal Wing",
    title: "Legal Wing",
    description: "Pro-bono legal counsel, citizen rights protection, and statutory advocacy.",
    icon: Scale,
  },
  {
    id: "Medical & Health Wing",
    title: "Medical & Health Wing",
    description: "Free medical health check-up camps, blood donation drives, and emergency aid.",
    icon: Stethoscope,
  },
  {
    id: "Education & Child Welfare",
    title: "Education & Child Welfare",
    description: "Academic coaching for underprivileged youth, book distribution, and scholarships.",
    icon: GraduationCap,
  },
  {
    id: "Youth & Sports Wing",
    title: "Youth & Sports Wing",
    description: "Athletics training, regional tournaments, discipline, and youth leadership camps.",
    icon: Trophy,
  },
  {
    id: "Community Seva & Mahaprasadam",
    title: "Community Seva & Mahaprasadam",
    description: "Mass food distribution at annual assemblies (Guru Poornima, Mahashivratri).",
    icon: UtensilsCrossed,
  },
  {
    id: "General Seva Cadre",
    title: "General Seva Cadre",
    description: "Multi-disciplinary volunteers for community development and on-ground activities.",
    icon: Users,
  },
];

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

const currentYearNum = new Date().getFullYear();
const YEARS = Array.from({ length: 110 }, (_, i) => String(currentYearNum - i));

const getDaysInMonth = (yearStr: string, monthStr: string) => {
  const y = parseInt(yearStr, 10) || 2000;
  const m = parseInt(monthStr, 10) || 1;
  return new Date(y, m, 0).getDate();
};

const calculateAge = (dobString: string): number | null => {
  if (!dobString) return null;
  const parts = dobString.split("-");
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (!y || !m || !d) return null;

  const today = new Date();
  let age = today.getFullYear() - y;
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  if (currentMonth < m || (currentMonth === m && currentDay < d)) {
    age--;
  }
  return age >= 0 ? age : null;
};

const formatDobDisplay = (dobString: string): string => {
  if (!dobString) return "";
  const parts = dobString.split("-");
  if (parts.length !== 3) return dobString;
  const [y, m, d] = parts;
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const idx = parseInt(m, 10) - 1;
  const monthName = monthNames[idx] || m;
  return `${d} ${monthName} ${y}`;
};

// Auto-capitalize first letter of words while typing live without disrupting typing flow
const capitalizeLive = (str: string): string => {
  if (!str) return "";
  return str.replace(/(?:^|\s|[-/.,'#])([a-z\u00C0-\u024F])/g, (char) => char.toUpperCase());
};

// Normalize names & words to clean Title Case on blur or submission
const normalizeTitleCase = (str: string): string => {
  if (!str) return "";
  const cleaned = str.trim().replace(/\s+/g, " ");
  // If the user typed entirely in uppercase (e.g. "DEEPU KUMAR"), convert to lower then title case
  const base = cleaned === cleaned.toUpperCase() ? cleaned.toLowerCase() : cleaned;
  return base.replace(/(?:^|\s|[-/.,'#])([a-z\u00C0-\u024F])/g, (char) => char.toUpperCase());
};

interface RegisterProps {
  defaultTab?: "register" | "status";
}

const Register: React.FC<RegisterProps> = ({ defaultTab = "register" }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const urlQuery = searchParams.get("id") || searchParams.get("query") || searchParams.get("mobile") || "";
  const initialTab =
    defaultTab === "status" ||
    location.pathname === "/status" ||
    location.pathname === "/verify" ||
    searchParams.get("tab") === "status" ||
    !!urlQuery
      ? "status"
      : "register";

  const [activeTab, setActiveTab] = useState<"register" | "status">(initialTab);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [registeredMember, setRegisteredMember] = useState<any>(null);

  // Status Check Portal State
  const [statusQuery, setStatusQuery] = useState(urlQuery);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusResult, setStatusResult] = useState<any>(null);
  const [statusQrUrl, setStatusQrUrl] = useState<string>("");
  const [copiedId, setCopiedId] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    dob: "",
    gender: "Male",
    mobile: "",
    whatsapp: "",
    email: "",
    bloodGroup: "",
    state: "",
    district: "",
    taluk: "",
    address: "",
    pincode: "",
    qualification: "Graduate",
    profession: "",
    wing: "Legal Wing",
    hoursAvailable: "5-10 hours/month",
    idProofType: "Aadhaar Card",
    idProofNumber: "",
    pledgeAccepted: false,
    termsAccepted: false,
  });

  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [customDistrict, setCustomDistrict] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [checkingMobile, setCheckingMobile] = useState(false);
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const nativeDateInputRef = React.useRef<HTMLInputElement | null>(null);
  const formCardRef = React.useRef<HTMLDivElement | null>(null);
  const errorBannerRef = React.useRef<HTMLDivElement | null>(null);

  // Photo state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawPhotoSrc, setRawPhotoSrc] = useState<string | null>(null);
  const [rawPhotoName, setRawPhotoName] = useState<string>("cadre_photo.jpg");

  // Field-level validation state for instant visual feedback while filling details
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Central Field-Level Validator
  const validateField = (
    field: string,
    value: any,
    currentFormData = formData,
    curCustomDist = customDistrict
  ): string => {
    switch (field) {
      case "photo": {
        if (!value && !photoFile && !photoPreview) {
          return "Passport size photograph is mandatory. Please upload a clear photo.";
        }
        return "";
      }
      case "fullName": {
        const val = String(value || "").trim();
        if (!val) return "Please enter your full legal name.";
        if (val.length < 3) return "Full Name must be at least 3 characters.";
        if (!/^[a-zA-Z\s.']+$/.test(val)) return "Name should contain only letters, dots, and spaces.";
        return "";
      }
      case "fatherName": {
        const val = String(value || "").trim();
        if (!val) return "Please enter father's or husband's name.";
        if (val.length < 3) return "Name must be at least 3 characters.";
        if (!/^[a-zA-Z\s.']+$/.test(val)) return "Name should contain only letters, dots, and spaces.";
        return "";
      }
      case "dob": {
        if (!value) return "Please select Day, Month, and Year of birth.";
        const age = calculateAge(value);
        if (age === null || age < 12) return "Member must be at least 12 years of age to register.";
        if (age > 115) return "Please enter a realistic date of birth.";
        return "";
      }
      case "gender": {
        if (!value || !["Male", "Female", "Other"].includes(value)) return "Please select a gender.";
        return "";
      }
      case "mobile": {
        const val = String(value || "").trim();
        if (!val) return "Please enter your primary mobile number.";
        if (val.length < 10) return "Mobile number must be exactly 10 digits.";
        if (!/^[6-9]\d{9}$/.test(val)) return "Must be a valid 10-digit number starting with 6, 7, 8, or 9.";
        return "";
      }
      case "whatsapp": {
        const val = String(value || "").trim();
        if (val && !/^[6-9]\d{9}$/.test(val)) return "WhatsApp number must be 10 digits starting with 6, 7, 8, or 9.";
        return "";
      }
      case "email": {
        const val = String(value || "").trim();
        if (val && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
          return "Please enter a valid email address.";
        }
        return "";
      }
      case "state": {
        if (!value) return "Please select your State / Union Territory.";
        return "";
      }
      case "district": {
        if (!value) return "Please select your District.";
        if (value === "Other District" && !curCustomDist.trim()) {
          return "Please enter your district name.";
        }
        return "";
      }
      case "customDistrict": {
        if (currentFormData.district === "Other District" && !String(value || "").trim()) {
          return "Please enter your district name.";
        }
        return "";
      }
      case "address": {
        const val = String(value || "").trim();
        if (!val) return "Please enter your residential address.";
        if (val.length < 8) return "Please provide complete address (min 8 characters).";
        return "";
      }
      case "pincode": {
        const val = String(value || "").trim();
        if (!val) return "Please enter your 6-digit PIN code.";
        if (!/^[1-9][0-9]{5}$/.test(val)) return "Please enter a valid 6-digit Indian PIN code.";
        return "";
      }
      case "wing": {
        if (!value) return "Please choose your primary MSD Wing.";
        return "";
      }
      case "pledgeAccepted": {
        if (!value) return "Please accept the Maha Seva Dal 1947 Seva Pledge.";
        return "";
      }
      case "termsAccepted": {
        if (!value) return "Please agree to the Terms & Conditions and Privacy Policy.";
        return "";
      }
      default:
        return "";
    }
  };

  const isFieldInvalid = (field: string) => Boolean(fieldErrors[field] && touchedFields[field]);

  const getInputClass = (field: string, extraClasses = "") =>
    `w-full text-sm px-3.5 py-2.5 rounded-lg border transition-colors ${
      isFieldInvalid(field)
        ? "border-rose-400 focus:border-rose-500 bg-rose-50/20 text-ink"
        : "border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200]"
    } ${extraClasses}`;

  const renderFieldError = (field: string) => {
    if (!isFieldInvalid(field)) return null;
    return (
      <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium animate-fade-in">
        <AlertCircle size={12} className="flex-shrink-0" />
        <span>{fieldErrors[field]}</span>
      </p>
    );
  };

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const val = field === "customDistrict" ? customDistrict : formData[field as keyof typeof formData];
    const err = validateField(field, val);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  };

  // Only align scroll upon final application submission so acknowledgment receipt is cleanly at the top of the viewport
  useLayoutEffect(() => {
    if (registeredMember) {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [registeredMember]);

  // Prevent accidental instant submit when arriving on slide 4
  useEffect(() => {
    if (step === 4) {
      setCanSubmit(false);
      const timer = setTimeout(() => {
        setCanSubmit(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setCanSubmit(false);
    }
  }, [step]);

  const handleDobSelect = (part: "day" | "month" | "year", value: string) => {
    const newDay = part === "day" ? value : dobDay;
    const newMonth = part === "month" ? value : dobMonth;
    const newYear = part === "year" ? value : dobYear;

    if (part === "day") setDobDay(value);
    if (part === "month") setDobMonth(value);
    if (part === "year") setDobYear(value);

    let combined = "";
    if (newDay && newMonth && newYear) {
      const maxDays = getDaysInMonth(newYear, newMonth);
      const validDay = parseInt(newDay, 10) > maxDays ? String(maxDays).padStart(2, "0") : newDay;
      if (validDay !== newDay) {
        setDobDay(validDay);
      }
      combined = `${newYear}-${newMonth.padStart(2, "0")}-${validDay.padStart(2, "0")}`;
      setFormData((prev) => ({ ...prev, dob: combined }));
    } else {
      setFormData((prev) => ({ ...prev, dob: "" }));
    }

    if (touchedFields.dob || (newDay && newMonth && newYear)) {
      setTouchedFields((prev) => ({ ...prev, dob: true }));
      const dobErr = validateField("dob", combined);
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (dobErr) next.dob = dobErr;
        else delete next.dob;
        return next;
      });
    }
  };

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const [y, m, d] = val.split("-");
      setDobYear(y || "");
      setDobMonth(m || "");
      setDobDay(d || "");
      setFormData((prev) => ({ ...prev, dob: val }));
    } else {
      setDobYear("");
      setDobMonth("");
      setDobDay("");
      setFormData((prev) => ({ ...prev, dob: "" }));
    }

    if (touchedFields.dob || val) {
      setTouchedFields((prev) => ({ ...prev, dob: true }));
      const dobErr = validateField("dob", val);
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (dobErr) next.dob = dobErr;
        else delete next.dob;
        return next;
      });
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
      if (step < 4) {
        handleNext();
      }
    }
  };

  useEffect(() => {
    if (urlQuery) {
      setActiveTab("status");
      fetchStatus(urlQuery);
    }
  }, []);

  const handleCopyId = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleDownloadReceiptPdf = async (memberData?: any) => {
    const targetMember =
      memberData && typeof memberData === "object" && typeof memberData.registrationId === "string"
        ? memberData
        : registeredMember;

    if (!targetMember || !targetMember.registrationId) {
      console.warn("No valid member found to download receipt PDF");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Outer border
      doc.setDrawColor(234, 88, 12);
      doc.setLineWidth(1.2);
      doc.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 4, 4, "S");

      // Header Brand
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(234, 88, 12);
      doc.text("MAHA SEVA DAL", 18, 26);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(115, 107, 94);
      doc.text("Estd. 1947 · National Cadre Enrollment Registry", 18, 32);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(40, 36, 32);
      doc.text("Official Application Acknowledgment Receipt", 18, 38.5);

      // Photo (top right)
      let photoData = "";
      const photoSrc = targetMember.photoUrl || photoPreview;
      if (photoSrc) {
        try {
          if (typeof photoSrc === "string" && photoSrc.startsWith("data:")) {
            photoData = photoSrc;
          } else if (typeof photoSrc === "string") {
            const proxyUrl = photoSrc.startsWith("http")
              ? getApiUrl(`/api/members/proxy-photo?url=${encodeURIComponent(photoSrc)}`)
              : photoSrc;

            const img = new Image();
            img.crossOrigin = "anonymous";
            const loaded = await new Promise<boolean>((resolve) => {
              const timer = setTimeout(() => resolve(false), 2000);
              img.onload = () => {
                clearTimeout(timer);
                resolve(true);
              };
              img.onerror = () => {
                clearTimeout(timer);
                resolve(false);
              };
              img.src = proxyUrl;
            });
            if (loaded && img.width > 0 && img.height > 0) {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                photoData = canvas.toDataURL("image/jpeg", 0.9);
              }
            }
          }
        } catch (e) {
          console.warn("Could not load photo for receipt PDF:", e);
        }
      }

      if (photoData) {
        try {
          doc.addImage(photoData, "JPEG", pageWidth - 46, 18, 28, 34);
          doc.setDrawColor(209, 213, 219);
          doc.setLineWidth(0.3);
          doc.rect(pageWidth - 46, 18, 28, 34, "S");
        } catch (e) {
          photoData = "";
        }
      }

      if (!photoData) {
        doc.setFillColor(250, 250, 249);
        doc.setDrawColor(209, 213, 219);
        doc.setLineWidth(0.3);
        doc.rect(pageWidth - 46, 18, 28, 34, "FD");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(156, 163, 175);
        doc.text("Photo Attached", pageWidth - 32, 35, { align: "center" });
      }

      // Divider line
      doc.setDrawColor(254, 215, 170);
      doc.setLineWidth(0.6);
      doc.line(18, 56, pageWidth - 18, 56);

      // Registration ID strip
      doc.setFillColor(255, 247, 237);
      doc.setDrawColor(255, 237, 213);
      doc.setLineWidth(0.4);
      doc.roundedRect(18, 60, pageWidth - 36, 20, 3, 3, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(154, 52, 18);
      doc.text("OFFICIAL REGISTRATION NUMBER", 24, 67);

      doc.setFont("courier", "bold");
      doc.setFontSize(16);
      doc.setTextColor(234, 88, 12);
      doc.text(String(targetMember.registrationId || "—"), 24, 75);

      // Status Tag
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(253, 230, 138);
      doc.roundedRect(pageWidth - 68, 65, 44, 9, 4, 4, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(146, 64, 14);
      doc.text("PENDING VERIFICATION", pageWidth - 46, 71, { align: "center" });

      // 8 Details Cards (2 cols x 4 rows)
      const colW = (pageWidth - 44) / 2;
      const startX = 18;
      const startY = 86;
      const cardH = 22;
      const gapY = 6;

      const items = [
        { label: "APPLICANT NAME", val: targetMember.fullName },
        { label: "ASSIGNED CADRE WING", val: targetMember.wing, color: [234, 88, 12] },
        {
          label: "STATE & DISTRICT",
          val: targetMember.district
            ? `${targetMember.district}, ${targetMember.state}`
            : targetMember.state,
        },
        { label: "PRIMARY MOBILE", val: targetMember.mobile },
        {
          label: "DATE OF BIRTH",
          val: targetMember.dob ? formatDobDisplay(targetMember.dob) : "—",
        },
        { label: "BLOOD GROUP", val: targetMember.bloodGroup || "Not Specified" },
        { label: "FATHER'S / SPOUSE NAME", val: targetMember.fatherName || "—" },
        {
          label: "SUBMISSION DATE",
          val: new Date(targetMember.createdAt || Date.now()).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        },
      ];

      items.forEach((item, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = startX + col * (colW + 8);
        const y = startY + row * (cardH + gapY);

        doc.setFillColor(250, 250, 249);
        doc.setDrawColor(231, 229, 228);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, y, colW, cardH, 2, 2, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(120, 113, 108);
        doc.text(item.label, x + 5, y + 7);

        doc.setFont("helvetica", "bold");
        const valStr = String(item.val || "—");
        doc.setFontSize(valStr.length > 28 ? 9 : 10.5);
        if (item.color) {
          doc.setTextColor(item.color[0], item.color[1], item.color[2]);
        } else {
          doc.setTextColor(28, 25, 23);
        }
        const maxW = colW - 10;
        const lineVal = doc.splitTextToSize(valStr, maxW)[0] || valStr;
        doc.text(lineVal, x + 5, y + 16);
      });

      // Cadre Notice Box (Strictly below row 3 - Zero overlap!)
      const totalRows = Math.ceil(items.length / 2);
      const noticeY = startY + totalRows * (cardH + gapY) + 6;
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.setLineWidth(0.4);
      doc.roundedRect(18, noticeY, pageWidth - 36, 34, 3, 3, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 58, 138);
      doc.text("Official Cadre Notice:", 24, noticeY + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(30, 64, 175);
      const noticeText =
        "This acknowledgment receipt confirms submission of your cadre enrollment application. In accordance with Maha Seva Dal bylaws, official PVC Digital Identity Cards and card download options are unlocked only after administrative committee verification and approval. No ID card is issued at the time of registration.";
      const splitNotice = doc.splitTextToSize(noticeText, pageWidth - 48);
      doc.text(splitNotice, 24, noticeY + 15);

      // Footer Strip
      const footerY = pageHeight - 20;
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.4);
      doc.line(18, footerY - 5, pageWidth - 18, footerY - 5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 113, 108);
      doc.text("Maha Seva Dal · National Cadre Registry", 18, footerY);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        pageWidth - 18,
        footerY,
        { align: "right" }
      );

      doc.save(`MSD-Receipt-${targetMember.registrationId}.pdf`);
    } catch (err: any) {
      console.error("PDF download error:", err);
    }
  };

  const handlePrintReceipt = (memberData?: any) => {
    const targetMember =
      memberData && typeof memberData === "object" && typeof memberData.registrationId === "string"
        ? memberData
        : registeredMember;
    if (!targetMember || !targetMember.registrationId) return;
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      window.print();
      return;
    }

    const photoHtml = targetMember.photoUrl || photoPreview
      ? `<img src="${targetMember.photoUrl || photoPreview}" alt="${targetMember.fullName}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #d1d5db;" />`
      : `<div style="width: 100px; height: 100px; border-radius: 8px; border: 1px dashed #9ca3af; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #6b7280; text-align: center;">Photo Attached</div>`;

    const appDate = new Date(targetMember.createdAt || Date.now()).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const receiptHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MSD Application Receipt - ${targetMember.registrationId}</title>
    <style>
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        -webkit-font-smoothing: subpixel-antialiased !important;
        text-rendering: optimizeLegibility !important;
      }
      body {
        font-family: Calibri, 'Trebuchet MS', 'Segoe UI', Candara, Arial, sans-serif;
        color: #1c1917;
        margin: 0;
        padding: 20px;
        background: #ffffff;
        font-size: 14px;
        line-height: 1.55;
        letter-spacing: normal;
      }
      p, span, div, strong, blockquote {
        -webkit-text-stroke: 0.04px transparent;
      }
      .receipt-box {
        max-width: 680px;
        margin: 0 auto;
        border: 2px solid #ea580c;
        border-radius: 12px;
        padding: 28px;
        background: #ffffff;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #fed7aa;
        padding-bottom: 18px;
        margin-bottom: 20px;
      }
      .header-text h1 {
        margin: 0;
        font-size: 22px;
        color: #ea580c;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: normal;
      }
      .header-text p {
        margin: 4px 0 0;
        font-size: 13px;
        color: #57534e;
        font-weight: 400;
        letter-spacing: normal;
      }
      .tag {
        display: inline-block;
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fde68a;
        padding: 5px 12px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: normal;
      }
      .reg-strip {
        background: #fff7ed;
        border: 1px solid #ffedd5;
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .reg-label {
        font-size: 11px;
        text-transform: uppercase;
        color: #9a3412;
        font-weight: 700;
        letter-spacing: normal;
      }
      .reg-id {
        font-size: 20px;
        font-family: "Courier New", Courier, monospace;
        font-weight: 700;
        color: #ea580c;
        margin-top: 2px;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        margin-bottom: 20px;
      }
      .item {
        background: #fafaf9;
        border: 1px solid #e7e5e4;
        border-radius: 8px;
        padding: 11px 14px;
      }
      .item-label {
        font-size: 11px;
        text-transform: uppercase;
        color: #57534e;
        font-weight: 700;
        margin-bottom: 4px;
        letter-spacing: normal;
      }
      .item-value {
        font-size: 14.5px;
        font-weight: 700;
        color: #1c1917;
        letter-spacing: normal;
      }
      .notice {
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        border-radius: 8px;
        padding: 14px 16px;
        font-size: 13px;
        color: #1e3a8a;
        line-height: 1.6;
        margin-bottom: 20px;
        letter-spacing: normal;
      }
      .footer-strip {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #e5e7eb;
        padding-top: 12px;
        font-size: 11.5px;
        color: #78716c;
        font-weight: 400;
        letter-spacing: normal;
      }
    </style>
  </head>
  <body>
    <div class="receipt-box">
      <div class="header">
        <div class="header-text">
          <h1>Maha Seva Dal</h1>
          <p>Estd. 1947 · National Cadre Enrollment Registry</p>
          <p style="margin-top: 6px; font-size: 13px; color: #44403c; font-weight: 700;">Official Application Acknowledgment Receipt</p>
        </div>
        <div>${photoHtml}</div>
      </div>

      <div class="reg-strip">
        <div>
          <div class="reg-label">Official Registration Number</div>
          <div class="reg-id">${targetMember.registrationId}</div>
        </div>
        <div class="tag">Pending Verification</div>
      </div>

      <div class="grid">
        <div class="item">
          <div class="item-label">Applicant Name</div>
          <div class="item-value">${targetMember.fullName}</div>
        </div>
        <div class="item">
          <div class="item-label">Assigned Cadre Wing</div>
          <div class="item-value" style="color: #ea580c;">${targetMember.wing}</div>
        </div>
        <div class="item">
          <div class="item-label">State & District</div>
          <div class="item-value">${targetMember.district ? `${targetMember.district}, ${targetMember.state}` : targetMember.state}</div>
        </div>
        <div class="item">
          <div class="item-label">Primary Mobile</div>
          <div class="item-value">${targetMember.mobile}</div>
        </div>
        <div class="item">
          <div class="item-label">Date of Birth</div>
          <div class="item-value">${targetMember.dob ? formatDobDisplay(targetMember.dob) : "—"}</div>
        </div>
        <div class="item">
          <div class="item-label">Blood Group</div>
          <div class="item-value">${targetMember.bloodGroup || "Not Specified"}</div>
        </div>
        <div class="item">
          <div class="item-label">Father's / Spouse Name</div>
          <div class="item-value">${targetMember.fatherName || "—"}</div>
        </div>
        <div class="item">
          <div class="item-label">Submission Date</div>
          <div class="item-value">${appDate}</div>
        </div>
      </div>

      <div class="notice">
        <strong>Official Cadre Notice:</strong> This acknowledgment receipt confirms submission of your cadre enrollment application. In accordance with Maha Seva Dal bylaws, official PVC Digital Identity Cards and card download options are unlocked <strong>only after administrative committee verification and approval</strong>. No ID card is issued at the time of registration.
      </div>

      <div class="footer-strip">
        <span>Maha Seva Dal · National Cadre Registry</span>
        <span>Generated on: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
    <script>
      function doPrint() {
        setTimeout(function() {
          window.focus();
          window.print();
        }, 300);
      }
      if (document.readyState === "complete") {
        doPrint();
      } else {
        window.addEventListener("load", doPrint);
      }
    </script>
  </body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  const fetchStatus = async (overrideQuery?: string) => {
    const raw = (overrideQuery !== undefined ? overrideQuery : statusQuery).trim();
    if (!raw) {
      setStatusError("Please enter your Registration ID or 10-digit mobile number.");
      return;
    }

    // Clean phone input if formatted with +91, leading 0, spaces, or hyphens
    let cleanPhone = raw.replace(/[\s\-\(\)]/g, "");
    if (cleanPhone.startsWith("+91")) cleanPhone = cleanPhone.slice(3);
    if (cleanPhone.startsWith("91") && cleanPhone.length === 12) cleanPhone = cleanPhone.slice(2);
    if (cleanPhone.startsWith("0") && cleanPhone.length === 11) cleanPhone = cleanPhone.slice(1);

    let q = raw;

    // Validate 10-digit mobile number if input is numeric
    if (/^\d+$/.test(cleanPhone)) {
      if (cleanPhone.length < 10) {
        setStatusError(`Mobile number must be exactly 10 digits. You entered ${cleanPhone.length} digits.`);
        return;
      }
      if (cleanPhone.length > 10) {
        setStatusError("Mobile number must be exactly 10 digits. Please check and try again.");
        return;
      }
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        setStatusError("Must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.");
        return;
      }
      q = cleanPhone; // use verified 10-digit number for API query
    } else {
      if (raw.length < 4) {
        setStatusError("Please enter a valid Registration ID (e.g. MSD-...) or 10-digit mobile number.");
        return;
      }
    }

    setStatusLoading(true);
    setStatusError("");
    setStatusResult(null);
    setStatusQrUrl("");

    try {
      const res = await fetch(getApiUrl(`/api/members/status?query=${encodeURIComponent(q)}`));
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "No member application found with the given details.");
      }

      setStatusResult(json.member);

      // If member is APPROVED, generate QR code for the ID card
      if (json.member.status === "APPROVED") {
        const qrText = `https://mahasevadal.com/verify?id=${json.member.registrationId}&name=${encodeURIComponent(
          json.member.fullName
        )}&wing=${encodeURIComponent(json.member.wing)}`;
        const qr = await QRCode.toDataURL(qrText, { width: 180, margin: 1 });
        setStatusQrUrl(qr);
      }
    } catch (err: any) {
      setStatusError(err.message || "Failed to check member status. Please try again.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state: newState,
      district: "",
    }));
    setCustomDistrict("");
    setTouchedFields((prev) => ({ ...prev, state: true, district: false }));
    const err = validateField("state", newState);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) next.state = err;
      else delete next.state;
      delete next.district;
      delete next.customDistrict;
      return next;
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrict = e.target.value;
    setFormData((prev) => ({
      ...prev,
      district: newDistrict,
    }));
    if (newDistrict !== "Other District") {
      setCustomDistrict("");
    }
    setTouchedFields((prev) => ({ ...prev, district: true }));
    const err = validateField("district", newDistrict);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) next.district = err;
      else delete next.district;
      if (newDistrict !== "Other District") {
        delete next.customDistrict;
      }
      return next;
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    let { value } = e.target;

    // Strict numerical & character filtering while typing
    if (name === "mobile" || name === "whatsapp") {
      value = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "pincode") {
      value = value.replace(/\D/g, "").slice(0, 6);
    } else if (name === "fullName" || name === "fatherName") {
      value = value.replace(/[^a-zA-Z\s.']/g, "");
    }

    const shouldCapitalize =
      name === "fullName" ||
      name === "fatherName" ||
      name === "taluk" ||
      name === "profession" ||
      name === "address";

    const formattedValue = shouldCapitalize ? capitalizeLive(value) : value;

    setFormData((prev) => {
      const next = { ...prev, [name]: formattedValue };
      if (name === "mobile" && sameAsMobile) {
        next.whatsapp = formattedValue;
      }
      return next;
    });

    // Real-time error clearance/update as the user fills in details
    if (touchedFields[name]) {
      const err = validateField(name, formattedValue);
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (err) next[name] = err;
        else delete next[name];
        return next;
      });
    }
  };

  const handleTitleCaseBlur = (field: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: normalizeTitleCase(String(prev[field] || "")),
    }));
    handleBlur(field as string);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRawPhotoName(file.name);
      setPhotoFile(file);
      setTouchedFields((prev) => ({ ...prev, photo: true }));
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.photo;
        return next;
      });
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPhotoPreview(reader.result);
          setRawPhotoSrc(reader.result);
          setCropModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleCropComplete = (croppedBlob: Blob, croppedDataUrl: string) => {
    const cleanName = rawPhotoName.replace(/\.[^/.]+$/, "") + "_cropped.jpg";
    const file = new File([croppedBlob], cleanName, { type: "image/jpeg" });
    setPhotoFile(file);
    setPhotoPreview(croppedDataUrl);
    setCropModalOpen(false);
    setTouchedFields((prev) => ({ ...prev, photo: true }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.photo;
      return next;
    });
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setRawPhotoSrc(null);
    setTouchedFields((prev) => ({ ...prev, photo: true }));
    setFieldErrors((prev) => ({
      ...prev,
      photo: "Passport size photograph is mandatory. Please upload a clear photo.",
    }));
  };

  const validateStep = (currentStep: number) => {
    setErrorMsg("");
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = { ...touchedFields };

    if (currentStep === 1) {
      const step1Fields = ["photo", "fullName", "fatherName", "dob", "gender", "mobile", "whatsapp", "email"];
      step1Fields.forEach((field) => {
        newTouched[field] = true;
        let val = formData[field as keyof typeof formData];
        if (field === "photo") val = (photoFile || photoPreview) as any;
        const err = validateField(field, val);
        if (err) newErrors[field] = err;
      });
    }

    if (currentStep === 2) {
      const step2Fields = ["state", "district", "address", "pincode"];
      step2Fields.forEach((field) => {
        newTouched[field] = true;
        const err = validateField(field, formData[field as keyof typeof formData]);
        if (err) newErrors[field] = err;
      });
      if (formData.district === "Other District") {
        newTouched["customDistrict"] = true;
        const customErr = validateField("customDistrict", customDistrict);
        if (customErr) newErrors["customDistrict"] = customErr;
      }
    }

    if (currentStep === 3) {
      newTouched["wing"] = true;
      const wingErr = validateField("wing", formData.wing);
      if (wingErr) newErrors["wing"] = wingErr;
    }

    if (currentStep === 4) {
      newTouched["pledgeAccepted"] = true;
      newTouched["termsAccepted"] = true;
      const pledgeErr = validateField("pledgeAccepted", formData.pledgeAccepted);
      if (pledgeErr) newErrors["pledgeAccepted"] = pledgeErr;
      const termsErr = validateField("termsAccepted", formData.termsAccepted);
      if (termsErr) newErrors["termsAccepted"] = termsErr;
    }

    setTouchedFields(newTouched);
    setFieldErrors((prev) => ({ ...prev, ...newErrors }));

    const firstError = Object.values(newErrors)[0];
    return firstError || null;
  };

  const validateAllSteps = () => {
    for (let s = 1; s <= 4; s++) {
      const err = validateStep(s);
      if (err) {
        setStep(s);
        return err;
      }
    }
    return null;
  };

  const scrollToCardTop = () => {
    setTimeout(() => {
      if (formCardRef.current) {
        if ((window as any).lenis && typeof (window as any).lenis.scrollTo === "function") {
          (window as any).lenis.scrollTo(formCardRef.current, { offset: -85, duration: 0.6 });
        } else {
          const cardTop = formCardRef.current.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: Math.max(0, cardTop - 85),
            behavior: "smooth",
          });
        }
      }
    }, 30);
  };

  const scrollToNotification = () => {
    setTimeout(() => {
      const banner = errorBannerRef.current || document.getElementById("registration-error-banner");
      if (banner) {
        if ((window as any).lenis && typeof (window as any).lenis.scrollTo === "function") {
          (window as any).lenis.scrollTo(banner, { offset: -110, duration: 0.7 });
        } else {
          const bannerRect = banner.getBoundingClientRect();
          const targetY = bannerRect.top + window.scrollY - 110;
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: "smooth",
          });
        }
        try {
          banner.focus({ preventScroll: true });
        } catch (_) {}
      } else if (formCardRef.current) {
        scrollToCardTop();
      }
    }, 60);
  };

  // Automatically smooth-scroll to error notification banner whenever an error message is populated
  useEffect(() => {
    if (errorMsg) {
      scrollToNotification();
    }
  }, [errorMsg]);

  const handleNext = async () => {
    const error = validateStep(step);
    if (error) {
      setErrorMsg(error);
      scrollToNotification();
      return;
    }

    // On Step 1, verify if mobile number is already registered before proceeding
    if (step === 1 && formData.mobile && /^[6-9]\d{9}$/.test(formData.mobile)) {
      try {
        setCheckingMobile(true);
        const res = await fetch(getApiUrl(`/api/members/status?query=${encodeURIComponent(formData.mobile.trim())}`));
        if (res.ok) {
          const json = await res.json();
          if (json?.member && ["PENDING", "APPROVED"].includes(json.member.status)) {
            const duplicateMsg = "This mobile number is already registered";
            setErrorMsg(duplicateMsg);
            setFieldErrors((prev) => ({
              ...prev,
              mobile: "This mobile number is already registered",
            }));
            setTouchedFields((prev) => ({ ...prev, mobile: true }));
            scrollToNotification();
            setCheckingMobile(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Pre-check mobile status error:", err);
      } finally {
        setCheckingMobile(false);
      }
    }

    setErrorMsg("");
    setStep((s) => Math.min(s + 1, 4));
    scrollToCardTop();
  };

  const handleBack = () => {
    setErrorMsg("");
    setStep((s) => Math.max(s - 1, 1));
    scrollToCardTop();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard against premature submits on earlier slides (e.g. Enter press)
    if (step < 4) {
      handleNext();
      return;
    }

    // Guard against accidental double clicks during slide 3 -> 4 transition
    if (!canSubmit) {
      return;
    }

    const error = validateAllSteps();
    if (error) {
      setErrorMsg(error);
      scrollToNotification();
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const finalDistrict =
        formData.district === "Other District" && customDistrict.trim()
          ? customDistrict.trim()
          : formData.district;

      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "district") {
          data.append(key, normalizeTitleCase(finalDistrict));
        } else if (
          key === "fullName" ||
          key === "fatherName" ||
          key === "taluk" ||
          key === "profession" ||
          key === "address"
        ) {
          data.append(key, normalizeTitleCase(String(val)));
        } else {
          data.append(key, String(val));
        }
      });
      if (photoFile) {
        data.append("photo", photoFile);
      }

      const res = await fetch(getApiUrl("/api/members/register"), {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok) {
        // If server sent detailed field validation errors, reflect them on inputs
        if (json.errors) {
          setFieldErrors((prev) => ({ ...prev, ...json.errors }));
          const marked: Record<string, boolean> = { ...touchedFields };
          Object.keys(json.errors).forEach((k) => (marked[k] = true));
          setTouchedFields(marked);
        }
        if (res.status === 409 || (json.error && json.error.toLowerCase().includes("already registered"))) {
          setFieldErrors((prev) => ({
            ...prev,
            mobile: "This mobile number is already registered",
          }));
          setTouchedFields((prev) => ({ ...prev, mobile: true }));
          throw new Error("This mobile number is already registered");
        }
        throw new Error(json.error || "Failed to submit registration");
      }

      // Record submitted member for official acknowledgment slip
      // CRITICAL: No ID card or download options are shown at registration time!
      setRegisteredMember(json.member);
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    } catch (err: any) {
      const msg = err.message || "Network error. Please make sure backend is running.";
      const displayMsg = msg.toLowerCase().includes("already registered")
        ? "This mobile number is already registered"
        : msg;
      setErrorMsg(displayMsg);
      scrollToNotification();
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <section className={`${registeredMember ? "py-4 sm:py-6" : "py-8 lg:py-14"} bg-canvas min-h-screen`}>
        <div className={`${activeTab === "status" ? "max-w-5xl" : "max-w-4xl"} mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300`}>
          {!registeredMember && (
            <>
              <PageHeader
                category="Estd. 1947 · National Cadre Registry"
                title="Cadre Membership & Verification"
                subtitle="Enroll as an official Maha Seva Dal member or track your application status to retrieve your verified PVC Digital Identity Card once approved."
              />

              {/* Top Toggle Tabs */}
              <div className="flex border-b border-hairline mb-8 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className={`pb-3 px-4 font-semibold text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === "register"
                      ? "border-[#FF6200] text-[#FF6200]"
                      : "border-transparent text-muted-editorial hover:text-ink"
                  }`}
                >
                  <UserPlus size={16} />
                  <span>1. Cadre Registration</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("status")}
                  className={`pb-3 px-4 font-semibold text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === "status"
                      ? "border-[#FF6200] text-[#FF6200]"
                      : "border-transparent text-muted-editorial hover:text-ink"
                  }`}
                >
                  <Search size={16} />
                  <span>2. Check Status & Download ID Card</span>
                </button>
              </div>
            </>
          )}

          {activeTab === "register" ? (
            /* If successfully registered, show official acknowledgment slip (NO CARD, NO DOWNLOAD OPTIONS) */
            registeredMember ? (
              <div
                ref={formCardRef}
                className="bg-white border border-hairline shadow-xl rounded-2xl p-5 sm:p-7 animate-fade-in max-w-3xl mx-auto space-y-4"
              >
                {/* 1. Sleek Success Header */}
                <div className="flex items-center gap-3.5 pb-3.5 border-b border-hairline">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-500/20 shadow-xs">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-ink leading-tight">
                        Enrollment Application Submitted!
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                        <Clock size={11} className="text-amber-600" /> Pending Committee Verification
                      </span>
                    </div>
                    <p className="text-xs text-muted-editorial mt-0.5">
                      Your cadre membership application has been received and saved in the National Cadre registry.
                    </p>
                  </div>
                </div>

                {/* 2. Official Registration Number Ribbon */}
                <div className="bg-[#fff9f4] border border-[#ffeedd] rounded-xl px-4 py-2.5 sm:py-3 flex items-center justify-between flex-wrap gap-2 shadow-2xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-editorial block">
                      Official Registration Number
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-black text-[#FF6200] tracking-tight">
                      {registeredMember.registrationId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyId(registeredMember.registrationId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-hairline text-xs font-semibold text-ink hover:text-[#FF6200] hover:border-[#FF6200]/40 transition-all cursor-pointer shadow-2xs"
                    title="Copy Registration ID"
                  >
                    {copiedId ? (
                      <>
                        <Check size={13} className="text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} className="text-muted-editorial" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 3. Important Details Summary Card */}
                <div className="bg-surface-soft/40 border border-hairline rounded-xl p-3.5 sm:p-4">
                  <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 pb-3 border-b border-hairline/80 mb-2.5">
                    {(registeredMember.photoUrl || photoPreview) ? (
                      <img
                        src={registeredMember.photoUrl || photoPreview}
                        alt={registeredMember.fullName}
                        className="w-12 h-14 sm:w-14 sm:h-16 rounded-lg object-cover border border-hairline shadow-xs flex-shrink-0 bg-white"
                      />
                    ) : (
                      <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-lg bg-surface-card border border-hairline flex flex-col items-center justify-center text-muted-editorial flex-shrink-0">
                        <User size={20} className="text-[#FF6200]" />
                        <span className="text-[8px] font-mono mt-0.5">Photo</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-2 text-xs flex-1 w-full">
                      <div>
                        <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                          Applicant Name
                        </span>
                        <span className="font-bold text-ink text-xs sm:text-sm block leading-snug">
                          {registeredMember.fullName}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                          Assigned Wing
                        </span>
                        <span className="font-serif font-bold text-[#FF6200] text-xs sm:text-sm block leading-snug">
                          {registeredMember.wing}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                          State & District
                        </span>
                        <span className="font-semibold text-ink text-xs sm:text-sm block leading-snug">
                          {registeredMember.district ? `${registeredMember.district}, ${registeredMember.state}` : registeredMember.state}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                          Registered Mobile
                        </span>
                        <span className="font-mono font-medium text-ink text-xs sm:text-sm block leading-snug">
                          +91 {registeredMember.mobile}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                          Date of Birth
                        </span>
                        <span className="font-semibold text-ink text-xs sm:text-sm block leading-snug">
                          {registeredMember.dob ? formatDobDisplay(registeredMember.dob) : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                          Application Date
                        </span>
                        <span className="font-medium text-ink text-xs sm:text-sm block leading-snug">
                          {new Date(registeredMember.createdAt || Date.now()).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Notice */}
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-editorial pt-0.5">
                    <AlertCircle size={12} className="text-amber-600 flex-shrink-0" />
                    <span>PVC Identity Cards are unlocked after administrative committee verification & approval.</span>
                  </div>
                </div>

                {/* 4. Action Buttons (All in one slide!) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setStatusQuery(registeredMember.registrationId);
                        setActiveTab("status");
                        fetchStatus(registeredMember.registrationId);
                        setRegisteredMember(null);
                      }}
                      className="btn-primary-coral flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs sm:text-sm px-5 py-2.5 font-bold shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <Search size={14} />
                      <span>Track Approval Status</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadReceiptPdf()}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs sm:text-sm px-4 py-2.5 font-semibold rounded-xl border border-[#FF6200]/30 bg-[#FF6200]/10 hover:bg-[#FF6200]/20 text-[#FF6200] shadow-xs transition-colors cursor-pointer"
                      title="Download official acknowledgment PDF"
                    >
                      <Download size={14} />
                      <span>Download Acknowledgment</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setRegisteredMember(null);
                      resetForm();
                      setStep(1);
                    }}
                    className="text-xs text-muted-editorial hover:text-[#FF6200] font-semibold underline cursor-pointer transition-colors"
                  >
                    + Register Another Member
                  </button>
                </div>
              </div>
            ) : (
            /* Multi-Step Enrollment Form */
            <div
              ref={formCardRef}
              className="card-feature-cream bg-white border border-hairline shadow-md rounded-2xl p-6 sm:p-10 scroll-mt-24"
            >
              {/* Stepper Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {[
                    { num: 1, label: "Personal Profile", icon: User },
                    { num: 2, label: "Address & Location", icon: MapPin },
                    { num: 3, label: "Profession & Wing", icon: Briefcase },
                    { num: 4, label: "Review & Oath", icon: ShieldCheck },
                  ].map((s) => {
                    const IconComp = s.icon;
                    const isActive = step === s.num;
                    const isCompleted = step > s.num;
                    return (
                      <div
                        key={s.num}
                        onClick={() => {
                          if (s.num < step) {
                            setErrorMsg("");
                            setStep(s.num);
                            scrollToCardTop();
                          }
                        }}
                        className={`flex-1 flex flex-col items-center text-center ${
                          s.num < step ? "cursor-pointer group" : ""
                        }`}
                        title={s.num < step ? `Return to Step ${s.num}: ${s.label}` : undefined}
                      >
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                            isCompleted
                              ? "bg-emerald-600 text-white shadow-sm group-hover:scale-105"
                              : isActive
                              ? "bg-[#FF6200] text-white ring-4 ring-[#FF6200]/20 shadow-md"
                              : "bg-surface-soft text-muted-editorial border border-hairline"
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 size={16} /> : <IconComp size={16} />}
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs font-medium mt-1.5 hidden sm:block transition-colors ${
                            isActive
                              ? "text-[#FF6200] font-semibold"
                              : isCompleted
                              ? "text-emerald-700 group-hover:underline"
                              : "text-muted-editorial"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Progress bar line */}
                <div className="w-full bg-surface-soft h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#FF6200] to-[#FF6200] h-full transition-all duration-300"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Error banner with auto-scroll ref */}
              {errorMsg && (
                <div
                  ref={errorBannerRef}
                  id="registration-error-banner"
                  role="alert"
                  aria-live="assertive"
                  tabIndex={-1}
                  className="flex items-center gap-2.5 p-3.5 mb-6 text-xs text-rose-800 bg-rose-50 border-2 border-rose-300 rounded-xl shadow-md animate-fade-in ring-4 ring-rose-400/20 scroll-mt-28 outline-none"
                >
                  <AlertCircle size={18} className="flex-shrink-0 text-rose-600 animate-pulse" />
                  <span className="font-semibold leading-relaxed">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
                <div className="min-h-[460px] sm:min-h-[500px] flex flex-col justify-between">
                  <div>
                    {/* STEP 1: Personal Details */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-hairline pb-3">
                      <h3 className="font-serif text-lg font-bold text-ink">Personal & Contact Profile</h3>
                      <p className="text-xs text-muted-editorial">
                        Provide official legal name and contact details as registered in identification documents.
                      </p>
                    </div>

                    {/* Photo Upload Section with Integrated Cropper */}
                    <div
                      className={`flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border transition-colors ${
                        isFieldInvalid("photo")
                          ? "border-rose-400 bg-rose-50/20 shadow-xs"
                          : "bg-surface-soft/60 border-hairline"
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        {photoPreview ? (
                          <div className="relative group">
                            <img
                              src={photoPreview}
                              alt="Passport Photo Preview"
                              className="w-24 h-28 rounded-xl object-cover border-2 border-[#FF6200] shadow-md bg-white"
                            />
                            <div
                              className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white p-0.5 rounded-full shadow-xs"
                              title="Passport Photo Cropped & Ready"
                            >
                              <CheckCircle2 size={15} />
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`w-24 h-28 rounded-xl flex flex-col items-center justify-center transition-colors ${
                              isFieldInvalid("photo")
                                ? "bg-rose-50 border-2 border-dashed border-rose-400 text-rose-600"
                                : "bg-surface-card border-2 border-dashed border-hairline text-muted-editorial"
                            }`}
                          >
                            <User size={32} className={isFieldInvalid("photo") ? "text-rose-500" : "text-muted-editorial/70"} />
                            <span className="text-[9px] mt-1.5 font-medium">Passport Photo *</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-center sm:text-left space-y-2">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <label
                            className={`inline-flex items-center gap-2 cursor-pointer text-xs px-3.5 py-2 rounded-lg font-semibold transition-colors shadow-2xs ${
                              isFieldInvalid("photo")
                                ? "bg-rose-600 text-white hover:bg-rose-700"
                                : "btn-secondary hover:bg-white"
                            }`}
                          >
                            <Upload size={14} />
                            <span>{photoPreview ? "Change Photo" : "Upload Passport Photograph * (Mandatory)"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoSelect}
                            />
                          </label>

                          {photoPreview && rawPhotoSrc && (
                            <button
                              type="button"
                              onClick={() => setCropModalOpen(true)}
                              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-[#e8d2be] bg-[#faf3ee] text-[#FF6200] hover:bg-[#faede3] font-semibold cursor-pointer transition-colors shadow-2xs"
                              title="Re-open Cropping Tool"
                            >
                              <Crop size={14} />
                              <span>Adjust Crop</span>
                            </button>
                          )}

                          {photoPreview && (
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                              title="Remove Photo"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {renderFieldError("photo")}

                        <p className="text-[11px] text-muted-editorial">
                          {photoPreview ? (
                            <span className="text-emerald-700 font-medium flex items-center gap-1 justify-center sm:justify-start">
                              <Check size={12} /> Passport photo cropped & optimized for official Cadre ID card.
                            </span>
                          ) : (
                            <span>
                              Passport photograph is <strong className="text-ink">mandatory</strong>. Select photo from device — an interactive cropping modal will open to position and frame your face.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          onBlur={() => handleTitleCaseBlur("fullName")}
                          placeholder="Enter Full Legal Name (as per ID)"
                          className={getInputClass("fullName", "capitalize")}
                        />
                        {renderFieldError("fullName")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Father's / Husband's Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          onBlur={() => handleTitleCaseBlur("fatherName")}
                          placeholder="Father's or Husband's Full Name"
                          className={getInputClass("fatherName", "capitalize")}
                        />
                        {renderFieldError("fatherName")}
                      </div>

                      {/* Small & Simple Date of Birth Input (Single Column) */}
                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Date of Birth <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <select
                            value={dobDay}
                            onChange={(e) => handleDobSelect("day", e.target.value)}
                            onBlur={() => handleBlur("dob")}
                            className={`w-full text-xs sm:text-sm px-2 py-2.5 rounded-lg border transition-colors ${
                              isFieldInvalid("dob")
                                ? "border-rose-400 focus:border-rose-500 bg-rose-50/20 text-ink"
                                : "border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200]"
                            }`}
                          >
                            <option value="">DD</option>
                            {Array.from(
                              { length: getDaysInMonth(dobYear, dobMonth) },
                              (_, i) => {
                                const d = String(i + 1).padStart(2, "0");
                                return (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                );
                              }
                            )}
                          </select>

                          <select
                            value={dobMonth}
                            onChange={(e) => handleDobSelect("month", e.target.value)}
                            onBlur={() => handleBlur("dob")}
                            className={`w-full text-xs sm:text-sm px-1.5 py-2.5 rounded-lg border transition-colors ${
                              isFieldInvalid("dob")
                                ? "border-rose-400 focus:border-rose-500 bg-rose-50/20 text-ink"
                                : "border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200]"
                            }`}
                          >
                            <option value="">MM</option>
                            {MONTHS.map((m) => (
                              <option key={m.value} value={m.value}>
                                {m.label}
                              </option>
                            ))}
                          </select>

                          <select
                            value={dobYear}
                            onChange={(e) => handleDobSelect("year", e.target.value)}
                            onBlur={() => handleBlur("dob")}
                            className={`w-full text-xs sm:text-sm px-1.5 py-2.5 rounded-lg border transition-colors ${
                              isFieldInvalid("dob")
                                ? "border-rose-400 focus:border-rose-500 bg-rose-50/20 text-ink"
                                : "border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200]"
                            }`}
                          >
                            <option value="">YYYY</option>
                            {YEARS.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                        {renderFieldError("dob")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Gender <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("gender")}
                          className={getInputClass("gender")}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {renderFieldError("gender")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Primary Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-editorial" />
                          <input
                            type="tel"
                            name="mobile"
                            maxLength={10}
                            value={formData.mobile}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur("mobile")}
                            placeholder="Enter 10-digit Mobile Number"
                            className={getInputClass("mobile", "pl-9 font-mono")}
                          />
                        </div>
                        {renderFieldError("mobile")}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-ink">
                            WhatsApp Number <span className="text-muted-editorial font-normal">(Optional)</span>
                          </label>
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] text-[#FF6200] font-medium hover:underline select-none">
                            <input
                              type="checkbox"
                              checked={sameAsMobile}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setSameAsMobile(checked);
                                if (checked) {
                                  setFormData((prev) => ({ ...prev, whatsapp: prev.mobile }));
                                  if (touchedFields.whatsapp) {
                                    const err = validateField("whatsapp", formData.mobile);
                                    setFieldErrors((f) => {
                                      const next = { ...f };
                                      if (err) next.whatsapp = err;
                                      else delete next.whatsapp;
                                      return next;
                                    });
                                  }
                                }
                              }}
                              className="rounded border-hairline text-[#FF6200] focus:ring-[#FF6200] w-3.5 h-3.5 cursor-pointer accent-[#FF6200]"
                            />
                            <span>Same as Mobile</span>
                          </label>
                        </div>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-editorial" />
                          <input
                            type="tel"
                            name="whatsapp"
                            maxLength={10}
                            value={formData.whatsapp}
                            onChange={(e) => {
                              if (sameAsMobile && e.target.value !== formData.mobile) {
                                setSameAsMobile(false);
                              }
                              handleInputChange(e);
                            }}
                            onBlur={() => handleBlur("whatsapp")}
                            placeholder={sameAsMobile ? (formData.mobile || "Same as Mobile") : "Enter 10-digit WhatsApp Number (Optional)"}
                            className={getInputClass("whatsapp", "pl-9 font-mono")}
                          />
                        </div>
                        {renderFieldError("whatsapp")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Email Address <span className="text-muted-editorial font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-editorial" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur("email")}
                            placeholder="Enter Email Address (Optional)"
                            className={getInputClass("email", "pl-9")}
                          />
                        </div>
                        {renderFieldError("email")}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Blood Group <span className="text-muted-editorial font-normal">(Optional)</span>
                        </label>
                        <select
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200] transition-colors"
                        >
                          <option value="">Select Blood Group (Optional)</option>
                          <option value="A+">A+ (A Positive)</option>
                          <option value="A-">A- (A Negative)</option>
                          <option value="B+">B+ (B Positive)</option>
                          <option value="B-">B- (B Negative)</option>
                          <option value="O+">O+ (O Positive)</option>
                          <option value="O-">O- (O Negative)</option>
                          <option value="AB+">AB+ (AB Positive)</option>
                          <option value="AB-">AB- (AB Negative)</option>
                          <option value="Not Specified">Not Specified / Don't Know</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Address & Location */}
                {step === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="border-b border-hairline pb-3">
                      <h3 className="font-serif text-lg font-bold text-ink">Location & Residential Address</h3>
                      <p className="text-xs text-muted-editorial">
                        Your State and District determine your local cadre committee and service coordination.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Row 1: State & District */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-ink mb-1">
                            State / Union Territory <span className="text-rose-500">*</span>
                          </label>
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleStateChange}
                            onBlur={() => handleBlur("state")}
                            className={getInputClass("state")}
                          >
                            <option value="">Select State / Union Territory</option>
                            {INDIAN_STATES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          {renderFieldError("state")}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-ink mb-1">
                            District Unit <span className="text-rose-500">*</span>
                          </label>
                          <select
                            name="district"
                            value={formData.district}
                            onChange={handleDistrictChange}
                            onBlur={() => handleBlur("district")}
                            disabled={!formData.state}
                            className={getInputClass("district", "disabled:opacity-60 disabled:cursor-not-allowed")}
                          >
                            <option value="">
                              {formData.state ? "Select District" : "Select State First"}
                            </option>
                            {formData.state &&
                              (STATE_DISTRICTS[formData.state] || ["Other District"]).map((dist) => (
                                <option key={dist} value={dist}>
                                  {dist}
                                </option>
                              ))}
                          </select>
                          {renderFieldError("district")}

                          {formData.district === "Other District" && (
                            <div className="mt-2">
                              <input
                                type="text"
                                value={customDistrict}
                                onChange={(e) => {
                                  const val = capitalizeLive(e.target.value);
                                  setCustomDistrict(val);
                                  if (touchedFields.customDistrict) {
                                    const err = validateField("customDistrict", val);
                                    setFieldErrors((prev) => {
                                      const next = { ...prev };
                                      if (err) next.customDistrict = err;
                                      else delete next.customDistrict;
                                      return next;
                                    });
                                  }
                                }}
                                onBlur={() => {
                                  setCustomDistrict((prev) => normalizeTitleCase(prev));
                                  handleBlur("customDistrict");
                                }}
                                placeholder="Enter District Name"
                                className={getInputClass("customDistrict", "text-xs sm:text-sm capitalize")}
                              />
                              {renderFieldError("customDistrict")}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Sub-district/Taluk & PIN Code */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-ink mb-1">
                            Taluk / Sub-District / Area <span className="text-muted-editorial font-normal">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            name="taluk"
                            value={formData.taluk}
                            onChange={handleInputChange}
                            onBlur={() => handleTitleCaseBlur("taluk")}
                            placeholder="Taluk, Tehsil or Locality (Optional)"
                            className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200] transition-colors capitalize"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-ink mb-1">
                            Postal PIN Code <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            maxLength={6}
                            value={formData.pincode}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur("pincode")}
                            placeholder="Enter 6-digit PIN Code"
                            className={getInputClass("pincode", "font-mono")}
                          />
                          {renderFieldError("pincode")}
                        </div>
                      </div>

                      {/* Row 3: Full Residential Address */}
                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Full Residential Address <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          name="address"
                          rows={2}
                          value={formData.address}
                          onChange={handleInputChange}
                          onBlur={() => handleTitleCaseBlur("address")}
                          placeholder="Door / Flat No, Building Name, Street, Landmark, Area"
                          className={getInputClass("address", "resize-none capitalize")}
                        />
                        {renderFieldError("address")}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Professional & Wing Allocation */}
                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-hairline pb-3">
                      <h3 className="font-serif text-lg font-bold text-ink">Profession & Wing Choice</h3>
                      <p className="text-xs text-muted-editorial">
                        Select your primary Seva Dal wing and optionally share your profession for skill-mapping and cadre coordination.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ink mb-1">
                        Current Profession / Occupation <span className="text-muted-editorial font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        onBlur={() => handleTitleCaseBlur("profession")}
                        placeholder="Advocate, Teacher, Doctor, Business, Student, Social Worker..."
                        className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200] transition-colors capitalize"
                      />
                      <p className="text-[11px] text-muted-editorial mt-1">
                        Optional: Used for official cadre skill-mapping and voluntary community seva coordination.
                      </p>
                    </div>

                    {/* Wing Selection Grid */}
                    <div>
                      <label className="block text-xs font-medium text-ink mb-3">
                        Choose Primary MSD Wing <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {WINGS.map((w) => {
                          const IconComp = w.icon;
                          const isSelected = formData.wing === w.id;
                          return (
                            <div
                              key={w.id}
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, wing: w.id }));
                                setTouchedFields((prev) => ({ ...prev, wing: true }));
                                setFieldErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.wing;
                                  return next;
                                });
                              }}
                              className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? "border-[#FF6200] bg-gradient-to-br from-[#FF6200]/10 via-[#FF6200]/5 to-transparent ring-2 ring-[#FF6200]/30 shadow-sm"
                                  : isFieldInvalid("wing")
                                  ? "border-rose-300 bg-rose-50/20 hover:border-rose-400"
                                  : "border-hairline bg-surface-soft/60 hover:bg-white hover:border-[#FF6200]/40 hover:shadow-xs hover:-translate-y-0.5"
                              }`}
                            >
                              {/* Selection Checkmark Badge */}
                              {isSelected && (
                                <div className="absolute top-3.5 right-3.5 bg-[#FF6200] text-white rounded-full p-0.5 shadow-2xs">
                                  <Check size={12} strokeWidth={3} />
                                </div>
                              )}

                              <div className="flex items-center gap-3 mb-1.5 pr-6">
                                <div
                                  className={`p-2 rounded-lg transition-colors ${
                                    isSelected
                                      ? "bg-[#FF6200] text-white shadow-2xs"
                                      : "bg-surface-card text-muted-editorial border border-hairline"
                                  }`}
                                >
                                  <IconComp size={16} />
                                </div>
                                <span className="font-serif font-bold text-sm text-ink">{w.title}</span>
                              </div>
                              <p className="text-[11px] text-muted-editorial leading-relaxed pl-1">
                                {w.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      {renderFieldError("wing")}
                    </div>
                  </div>
                )}

                {/* STEP 4: Review & The 1947 Seva Pledge */}
                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-hairline pb-3">
                      <h3 className="font-serif text-lg font-bold text-ink">Review & Oath of Service</h3>
                      <p className="text-xs text-muted-editorial">
                        Review your application details and take the founding pledge of Maha Seva Dal.
                      </p>
                    </div>

                    {/* Application Review Summary Card */}
                    <div className="bg-surface-soft/90 border border-hairline rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-hairline">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#FF6200]/10 flex items-center justify-center text-[#FF6200]">
                            <FileText size={16} />
                          </div>
                          <div>
                            <span className="font-serif font-bold text-sm text-ink block leading-tight">
                              Enrollment Summary Review
                            </span>
                            <span className="text-[11px] text-muted-editorial">
                              Verify all your submitted details before official enrollment
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 1: Personal & Contact Information (with Passport Photo) */}
                      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-hairline shadow-2xs">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-hairline/60">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-[#FF6200]" />
                            <span className="text-xs font-bold uppercase tracking-wider text-ink">
                              1. Personal & Contact Profile
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setStep(1);
                              scrollToCardTop();
                            }}
                            className="text-[11px] font-semibold text-[#FF6200] hover:text-[#d95300] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit3 size={11} />
                            <span>Edit Step 1</span>
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          {/* Cadre Passport Photo Preview */}
                          <div className="flex-shrink-0 self-center sm:self-start flex flex-col items-center">
                            {photoPreview ? (
                              <div className="relative group">
                                <img
                                  src={photoPreview}
                                  alt="Cadre Photo"
                                  className="w-20 h-24 rounded-xl object-cover border-2 border-[#FF6200] shadow-sm bg-white"
                                />
                                <div
                                  className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white p-0.5 rounded-full shadow-xs"
                                  title="Passport Photo Attached"
                                >
                                  <Check size={11} strokeWidth={3} />
                                </div>
                              </div>
                            ) : (
                              <div className="w-20 h-24 rounded-xl bg-surface-card border-2 border-dashed border-hairline flex flex-col items-center justify-center text-muted-editorial text-center p-1.5">
                                <User size={26} className="text-muted-editorial/60" />
                                <span className="text-[8px] mt-1 font-medium text-rose-500">No Photo</span>
                              </div>
                            )}
                            <span className="text-[8.5px] font-semibold text-muted-editorial mt-1 uppercase tracking-wider">
                              Cadre Photo
                            </span>
                          </div>

                          {/* Personal Details Grid */}
                          <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 text-xs">
                            <div>
                              <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                                Full Legal Name
                              </span>
                              <span className="font-bold text-ink text-sm sm:text-base leading-tight block">
                                {formData.fullName || "—"}
                              </span>
                            </div>

                            <div>
                              <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                                Father / Husband Name
                              </span>
                              <span className="font-semibold text-ink text-xs sm:text-sm block">
                                {formData.fatherName || "—"}
                              </span>
                            </div>

                            <div>
                              <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                                Date of Birth
                              </span>
                              <span className="font-semibold text-ink block">
                                {formData.dob ? formatDobDisplay(formData.dob) : "—"}
                              </span>
                            </div>

                            <div>
                              <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                                Gender
                              </span>
                              <span className="font-semibold text-ink block">{formData.gender || "—"}</span>
                            </div>

                            <div>
                              <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                                Blood Group
                              </span>
                              <span className="font-semibold text-ink block">
                                {formData.bloodGroup ? (
                                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                    {formData.bloodGroup}
                                  </span>
                                ) : (
                                  <span className="text-muted-editorial">Not Specified</span>
                                )}
                              </span>
                            </div>

                            <div>
                              <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                                Primary Mobile
                              </span>
                              <span className="font-mono font-bold text-ink text-xs sm:text-sm block">
                                {formData.mobile ? `+91 ${formData.mobile}` : "—"}
                              </span>
                            </div>

                            <div>
                              <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                                WhatsApp Number
                              </span>
                              <span className="font-medium text-ink truncate block">
                                {sameAsMobile ? (
                                  <span className="font-medium text-ink">Same as Mobile</span>
                                ) : formData.whatsapp && formData.whatsapp.trim() ? (
                                  formData.whatsapp.trim() === formData.mobile ? (
                                    <span className="font-medium text-ink">Same as Mobile</span>
                                  ) : (
                                    <span className="font-mono font-bold text-ink">+91 {formData.whatsapp.trim()}</span>
                                  )
                                ) : (
                                  <span className="text-muted-editorial italic">Not Provided</span>
                                )}
                              </span>
                            </div>

                            <div className="col-span-2 sm:col-span-2">
                              <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                                Email Address
                              </span>
                              <span className="font-medium text-ink truncate block">
                                {formData.email ? (
                                  formData.email
                                ) : (
                                  <span className="text-muted-editorial italic">Not Provided</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 2: Address & Location */}
                      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-hairline shadow-2xs">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-hairline/60">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-[#FF6200]" />
                            <span className="text-xs font-bold uppercase tracking-wider text-ink">
                              2. Address & Location
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setStep(2);
                              scrollToCardTop();
                            }}
                            className="text-[11px] font-semibold text-[#FF6200] hover:text-[#d95300] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit3 size={11} />
                            <span>Edit Step 2</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2.5 text-xs">
                          <div>
                            <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                              State Unit
                            </span>
                            <span className="font-bold text-ink block">{formData.state || "—"}</span>
                          </div>

                          <div>
                            <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                              District Unit
                            </span>
                            <span className="font-bold text-ink block">
                              {formData.district === "Other District" && customDistrict.trim()
                                ? customDistrict.trim()
                                : formData.district || "—"}
                            </span>
                          </div>

                          <div>
                            <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                              Taluk / Area
                            </span>
                            <span className="font-semibold text-ink block">
                              {formData.taluk?.trim() || "—"}
                            </span>
                          </div>

                          <div>
                            <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                              Postal PIN Code
                            </span>
                            <span className="font-mono font-bold text-ink block">{formData.pincode || "—"}</span>
                          </div>

                          <div className="col-span-2 sm:col-span-4 pt-2 border-t border-hairline/60">
                            <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider">
                              Full Residential Address
                            </span>
                            <span className="font-medium text-ink block leading-relaxed">
                              {formData.address?.trim() || "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 3: Chosen Wing & Cadre Profession */}
                      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-hairline shadow-2xs">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-hairline/60">
                          <div className="flex items-center gap-2">
                            <Briefcase size={14} className="text-[#FF6200]" />
                            <span className="text-xs font-bold uppercase tracking-wider text-ink">
                              3. Wing & Profession
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setStep(3);
                              scrollToCardTop();
                            }}
                            className="text-[11px] font-semibold text-[#FF6200] hover:text-[#d95300] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit3 size={11} />
                            <span>Edit Step 3</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="bg-[#fff9f4] border border-[#ffeedd] rounded-lg p-2.5">
                            <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider mb-0.5">
                              Assigned MSD Wing
                            </span>
                            <span className="font-serif font-black text-[#FF6200] text-sm sm:text-base block">
                              {formData.wing}
                            </span>
                          </div>

                          <div className="bg-surface-soft/60 border border-hairline rounded-lg p-2.5">
                            <span className="text-muted-editorial block text-[9.5px] uppercase font-bold tracking-wider mb-0.5">
                              Profession / Occupation
                            </span>
                            <span className="font-semibold text-ink text-xs sm:text-sm block">
                              {formData.profession.trim() || (
                                <span className="text-muted-editorial font-medium">Not Specified</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Official 1947 Seva Pledge Box */}
                    <div className="bg-gradient-to-r from-[#faf7ee] to-[#f4ece0] border-2 border-[#e6dbc8] rounded-xl p-5 sm:p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-[#FF6200]">
                        <ShieldCheck size={18} />
                        <span className="font-serif font-bold text-sm uppercase tracking-wider text-ink">
                          The 1947 Maha Seva Dal Pledge
                        </span>
                      </div>
                      <blockquote className="font-serif text-xs sm:text-sm text-ink/80 italic leading-relaxed border-l-2 border-[#FF6200] pl-4 my-3">
                        “I solemnly pledge to dedicate my service toward the foundational motto of Maha Seva Dal: Unity of People, selfless social welfare, youth empowerment, and communal harmony without bias of caste, creed, or regional differences.”
                      </blockquote>
                      <div className="mt-4 pt-3 border-t border-[#e2d6c1] space-y-3">
                        <div>
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.pledgeAccepted}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData((prev) => ({ ...prev, pledgeAccepted: checked }));
                                setTouchedFields((prev) => ({ ...prev, pledgeAccepted: true }));
                                setFieldErrors((prev) => {
                                  const next = { ...prev };
                                  if (checked) delete next.pledgeAccepted;
                                  else next.pledgeAccepted = "Please accept the Maha Seva Dal 1947 Seva Pledge.";
                                  return next;
                                });
                              }}
                              className="mt-1 w-4 h-4 rounded text-[#FF6200] border-hairline focus:ring-[#FF6200]"
                            />
                            <span className="text-xs text-ink font-medium">
                              I accept the Maha Seva Dal Oath of Service and certify that all details provided are true and accurate.
                            </span>
                          </label>
                          {renderFieldError("pledgeAccepted")}
                        </div>

                        <div className="pt-2.5 border-t border-[#e2d6c1]/70">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.termsAccepted}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData((prev) => ({ ...prev, termsAccepted: checked }));
                                setTouchedFields((prev) => ({ ...prev, termsAccepted: true }));
                                setFieldErrors((prev) => {
                                  const next = { ...prev };
                                  if (checked) delete next.termsAccepted;
                                  else next.termsAccepted = "Please agree to the Terms & Conditions and Privacy Policy.";
                                  return next;
                                });
                              }}
                              className="mt-1 w-4 h-4 rounded text-[#FF6200] border-hairline focus:ring-[#FF6200]"
                            />
                            <span className="text-xs text-ink leading-relaxed">
                              I have read and agree to the{" "}
                              <Link
                                to="/terms"
                                target="_blank"
                                className="text-[#FF6200] font-semibold underline hover:text-[#D65000]"
                              >
                                Terms & Conditions
                              </Link>{" "}
                              and{" "}
                              <Link
                                to="/privacy"
                                target="_blank"
                                className="text-[#FF6200] font-semibold underline hover:text-[#D65000]"
                              >
                                Privacy Policy
                              </Link>
                              , and consent to voluntary identity verification under the DPDP Act, 2023.
                            </span>
                          </label>
                          {renderFieldError("termsAccepted")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </div>

                {/* Form Navigation Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-hairline mt-5">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn-secondary flex items-center gap-2 text-xs px-4 py-2.5 w-full sm:w-auto justify-center"
                    >
                      <ArrowLeft size={14} />
                      <span>Previous Step</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={checkingMobile}
                      className="btn-primary-coral flex items-center gap-2 text-xs px-5 py-2.5 w-full sm:w-auto justify-center disabled:opacity-60"
                    >
                      {checkingMobile ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Checking Mobile...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                      <button
                        type="submit"
                        disabled={loading || !canSubmit || !formData.pledgeAccepted || !formData.termsAccepted}
                        className="btn-primary-coral flex items-center gap-2 text-xs px-6 py-2.5 font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center transition-all"
                      >
                        {loading ? (
                          <>
                            <RefreshCw size={15} className="animate-spin mr-1" />
                            <span>Enrolling Member...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={16} />
                            <span>Submit Official Enrollment</span>
                          </>
                        )}
                      </button>
                      {(!formData.pledgeAccepted || !formData.termsAccepted) && (
                        <span className="text-[10px] text-muted-editorial mt-1.5 text-center sm:text-right">
                          Please accept the pledge and terms above to enable submission
                        </span>
                      )}
                    </div>
                  )}
                </div>
                </div>
              </form>
            </div>
          )
        ) : (
            /* Check Status & Download ID Card Portal */
            <div className="card-feature-cream bg-white border border-hairline shadow-lg rounded-2xl p-6 sm:p-10 animate-fade-in">
              {/* Portal Header */}
              <div className="text-center max-w-xl mx-auto mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6200]/10 text-[#FF6200] mb-3">
                  <ShieldCheck size={14} />
                  <span>National Cadre Verification</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
                  Check Membership Status & Download ID Card
                </h2>
                <p className="text-xs sm:text-sm text-muted-editorial mt-2">
                  Enter your Registration ID or 10-digit registered mobile number to check committee approval status. Once approved, your official Digital PVC Identity Card and download options will be unlocked.
                </p>
              </div>

              {/* Search Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchStatus();
                }}
                className="max-w-xl mx-auto mb-8"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={statusQuery}
                      onChange={(e) => {
                        const val = e.target.value;
                        // If purely digits entered, prevent typing more than 10 digits
                        if (/^\d+$/.test(val) && val.length > 10) {
                          return;
                        }
                        setStatusQuery(val);
                        setStatusError("");
                      }}
                      placeholder="Enter Registration ID or 10-digit Mobile Number"
                      className="w-full px-4 py-3 text-sm bg-surface-soft/60 border border-hairline rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6200]/30 font-medium text-ink placeholder:text-muted-editorial/60"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={statusLoading}
                    className="btn-primary-coral flex items-center justify-center gap-2 text-xs font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 whitespace-nowrap"
                  >
                    {statusLoading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Search size={14} />
                        <span>Check Status</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Error Alert */}
              {statusError && (
                <div className="max-w-xl mx-auto flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 mb-8 text-xs animate-fade-in">
                  <AlertCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      {statusError.includes("10 digits") || statusError.includes("starting with") || statusError.includes("Please enter")
                        ? "Verification Notice"
                        : "Application Not Found"}
                    </p>
                    <p className="text-rose-700 mt-0.5">{statusError}</p>
                  </div>
                </div>
              )}

              {/* Status Results Display */}
              {statusResult && (
                <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                  {/* CASE 1: PENDING - NO CARD, NO DOWNLOAD OPTIONS */}
                  {statusResult.status === "PENDING" && (
                    <div className="border border-amber-200 bg-amber-50/70 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 border border-amber-300">
                        <Clock size={24} />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-900 mb-2">
                        Status: Under Review (Pending)
                      </span>
                      <h3 className="text-lg font-bold text-amber-950">
                        Application Awaiting Committee Verification
                      </h3>
                      <p className="text-xs text-amber-800 mt-2 max-w-lg mx-auto">
                        Your application has been received and is currently under statutory review by the Maha Seva Dal Executive Committee. 
                        <strong> Official Digital Identity Cards and card download options are unlocked only after committee approval.</strong>
                      </p>

                      {/* Member Details */}
                      <div className="bg-white/80 border border-amber-200 rounded-xl p-4 mt-6 text-left grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-editorial block">Registration ID</span>
                          <span className="font-mono font-bold text-ink">{statusResult.registrationId}</span>
                        </div>
                        <div>
                          <span className="text-muted-editorial block">Full Name</span>
                          <span className="font-semibold text-ink">{statusResult.fullName}</span>
                        </div>
                        <div>
                          <span className="text-muted-editorial block">Wing</span>
                          <span className="font-medium text-ink">{statusResult.wing}</span>
                        </div>
                        <div>
                          <span className="text-muted-editorial block">Region</span>
                          <span className="font-medium text-ink">{statusResult.district}, {statusResult.state}</span>
                        </div>
                      </div>

                      <div className="mt-5 text-[11px] text-amber-700 bg-amber-100/60 rounded-lg p-3">
                        💡 Please check back after 24-48 hours. Once the Admin approves your membership in the secretariat portal, your ID card download options will appear right here.
                      </div>

                      <div className="mt-4 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleDownloadReceiptPdf(statusResult)}
                          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100/80 text-amber-900 transition-colors shadow-xs cursor-pointer"
                          title="Download official acknowledgment PDF"
                        >
                          <Download size={14} className="text-[#FF6200]" />
                          <span>Download Acknowledgment</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CASE 2: REJECTED - NO CARD, NO DOWNLOAD OPTIONS */}
                  {statusResult.status === "REJECTED" && (
                    <div className="border border-rose-200 bg-rose-50/70 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3 border border-rose-300">
                        <AlertCircle size={24} />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-200 text-rose-900 mb-2">
                        Status: Application Not Approved (Rejected)
                      </span>
                      <h3 className="text-lg font-bold text-rose-950">
                        Membership Application Not Accepted
                      </h3>
                      <p className="text-xs text-rose-800 mt-2 max-w-lg mx-auto">
                        Your application could not be verified by the committee at this time. For clarification or to re-apply with corrected credentials, please reach out to the Maha Seva Dal Secretariat.
                      </p>

                      <div className="bg-white/80 border border-rose-200 rounded-xl p-4 mt-6 text-left grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-editorial block">Registration ID</span>
                          <span className="font-mono font-bold text-ink">{statusResult.registrationId}</span>
                        </div>
                        <div>
                          <span className="text-muted-editorial block">Full Name</span>
                          <span className="font-semibold text-ink">{statusResult.fullName}</span>
                        </div>
                      </div>

                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("register");
                            setStep(1);
                            setRegisteredMember(null);
                          }}
                          className="btn-secondary text-xs px-4 py-2 font-medium"
                        >
                          Submit New Application
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CASE 3: APPROVED - SHOW THE CARD AND DOWNLOAD OPTIONS */}
                  {statusResult.status === "APPROVED" && (
                    <div className="space-y-6">
                      {/* Approval Banner */}
                      <div className="flex items-start gap-4 text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-300">
                          <ShieldCheck size={22} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm sm:text-base text-emerald-950">
                              Membership Approved · Official Cadre Member
                            </h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-200 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 size={12} /> Verified
                            </span>
                          </div>
                          <p className="text-xs text-emerald-700 mt-1">
                            Congratulations! Your membership has been approved by the Maha Seva Dal Secretariat. Your official Digital PVC Identity Card is ready below with download and print options.
                          </p>
                        </div>
                      </div>

                      {/* Official PVC Digital Identity Card with Download & Print Options */}
                      <div className="flex justify-center pt-2">
                        <DigitalIdCard member={statusResult} qrDataUrl={statusQrUrl} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── PASSPORT PHOTO CROP MODAL ─────────────────────────────────────── */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={rawPhotoSrc}
        onClose={() => setCropModalOpen(false)}
        onCropComplete={handleCropComplete}
        onUseOriginal={() => setCropModalOpen(false)}
        title="Official ID Photo Framing"
      />
    </PageLayout>
  );
};

export default Register;
