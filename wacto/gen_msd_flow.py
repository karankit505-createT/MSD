#!/usr/bin/env python3
"""
Generator for Maha Seva Dal (MSD) WACTO WhatsApp Chatbot Flow v1 (English).
Strictly complies with wacto-flow SKILL.md rules and golden_working_flow_v9e patterns.
"""
import json, uuid, os, sys

def gen_id():
    return str(uuid.uuid4())

def build_msd_flow():
    nodes = []
    edges = []

    # Map to track edge keywords to guarantee single-destination routing
    keyword_dests = {}

    def add_edge(from_id, to_id, keyword, intent_name=None, delay=0, source_handle=None):
        if intent_name is None:
            intent_name = keyword
        edge = {
            "fromNodeId": from_id,
            "toNodeId": to_id,
            "keywords": [keyword],
            "intentName": intent_name,
            "delay": delay
        }
        if source_handle:
            edge["sourceHandle"] = source_handle
        edges.append(edge)
        keyword_dests.setdefault(keyword, set()).add(to_id)
        return edge

    # -------------------------------------------------------------
    # 1. ROOT NODE
    # -------------------------------------------------------------
    root_btn_join_id = gen_id()
    root_btn_wings_id = gen_id()
    root_btn_services_id = gen_id()

    root_node = {
        "nodeId": "root",
        "type": "interactive",
        "name": "Root Node",
        "interactiveId": None,
        "keywords": [
            "Hi", "Hello", "Hey", "Start", "Menu",
            "hi", "hello", "hey", "start", "menu", "MSD", "msd"
        ],
        "parentNodeId": None,
        "data": {
            "interactiveType": "button",
            "header": {"type": "text", "text": "Maha Seva Dal"},
            "body": "Welcome to Maha Seva Dal (Unity of People's).\n\nDedicated to selfless community service, healthcare, child welfare, legal empowerment, and youth development.\n\nHow can we serve together today?",
            "footer": "Select an option below",
            "action": {
                "buttons": [
                    {"type": "reply", "reply": {"id": root_btn_join_id, "title": "Join Maha Seva Dal"}},
                    {"type": "reply", "reply": {"id": root_btn_wings_id, "title": "Seva Wings & Causes"}},
                    {"type": "reply", "reply": {"id": root_btn_services_id, "title": "Member Services"}}
                ]
            }
        }
    }
    nodes.append(root_node)

    # -------------------------------------------------------------
    # 2. SELECT SEVA WING NODE (for registration)
    # -------------------------------------------------------------
    wing_node_id = gen_id()
    wing_rows_defs = [
        ("Legal Wing", "Free legal aid, citizen rights awareness, community justice"),
        ("Medical & Health", "Free medical camps, blood donation drives, health checkups"),
        ("Education & Child Care", "Child welfare, study materials, student mentorship"),
        ("Youth & Sports Wing", "Youth leadership, sports tournaments, fitness awareness"),
        ("Community & Mahaprasad", "Annadanam, community food drives, emergency relief aid"),
        ("General Seva Cadre", "General volunteering, field assistance, event coordination")
    ]

    wing_rows = []
    wing_row_ids = {}
    for title, desc in wing_rows_defs:
        rid = gen_id()
        wing_row_ids[title] = rid
        wing_rows.append({"id": rid, "title": title, "description": desc})

    wing_node = {
        "nodeId": wing_node_id,
        "type": "interactive",
        "name": "Register: Select Wing",
        "interactiveId": root_btn_join_id,
        "keywords": ["Join Maha Seva Dal"],
        "parentNodeId": "root",
        "data": {
            "interactiveType": "list",
            "header": {"type": "text", "text": "MSD Volunteer Wings"},
            "body": "Please select the Seva Wing you wish to join and dedicate your voluntary service towards:",
            "footer": "Choose 1 wing to continue",
            "action": {
                "button": "Choose Seva Wing",
                "sections": [
                    {
                        "title": "Available Wings",
                        "rows": wing_rows
                    }
                ]
            }
        }
    }
    nodes.append(wing_node)
    add_edge("root", wing_node_id, "Join Maha Seva Dal", source_handle=root_btn_join_id)

    # -------------------------------------------------------------
    # 3. DISTRICT SELECTION (5 PAGES - 38 DISTRICTS)
    # -------------------------------------------------------------
    districts_p1 = [
        "Ariyalur District", "Chengalpattu District", "Chennai District",
        "Coimbatore District", "Cuddalore District", "Dharmapuri District",
        "Dindigul District", "Erode District", "Kallakurichi District"
    ]
    districts_p2 = [
        "Kanchipuram District", "Kanyakumari District", "Karur District",
        "Krishnagiri District", "Madurai District", "Mayiladuthurai District",
        "Nagapattinam District", "Namakkal District", "Nilgiris District"
    ]
    districts_p3 = [
        "Perambalur District", "Pudukkottai District", "Ramanathapuram District",
        "Ranipet District", "Salem District", "Sivaganga District",
        "Tenkasi District", "Thanjavur District", "Theni District"
    ]
    districts_p4 = [
        "Thoothukudi District", "Tiruchirappalli District", "Tirunelveli District",
        "Tirupathur District", "Tiruppur District", "Tiruvallur District",
        "Tiruvannamalai District", "Tiruvarur District"
    ]
    districts_p5 = [
        "Vellore District", "Viluppuram District", "Virudhunagar District"
    ]

    dist_p1_id = gen_id()
    dist_p2_id = gen_id()
    dist_p3_id = gen_id()
    dist_p4_id = gen_id()
    dist_p5_id = gen_id()

    # All wing selections point to District Page 1
    for title, _ in wing_rows_defs:
        add_edge(wing_node_id, dist_p1_id, title, source_handle=wing_row_ids[title])

    # -------------------------------------------------------------
    # 4. REGISTRATION CONFIRMATION NODE
    # -------------------------------------------------------------
    reg_confirm_id = gen_id()
    btn_submit_id = gen_id()
    btn_change_wing_id = gen_id()
    btn_main_menu_id = gen_id()

    reg_confirm_node = {
        "nodeId": reg_confirm_id,
        "type": "interactive",
        "name": "Register: Confirm Details",
        "interactiveId": None,
        "keywords": ["District Selected"],
        "parentNodeId": dist_p1_id,
        "data": {
            "interactiveType": "button",
            "header": {"type": "text", "text": "Registration Summary"},
            "body": "Thank you for choosing to serve with Maha Seva Dal!\n\nYour Seva Wing and District have been recorded.\n\nTap 'Confirm Registration' to complete your enrollment and receive your unique Member ID.",
            "footer": "Maha Seva Dal Foundation",
            "action": {
                "buttons": [
                    {"type": "reply", "reply": {"id": btn_submit_id, "title": "Confirm Registration"}},
                    {"type": "reply", "reply": {"id": btn_change_wing_id, "title": "Change Wing"}},
                    {"type": "reply", "reply": {"id": btn_main_menu_id, "title": "Main Menu"}}
                ]
            }
        }
    }
    nodes.append(reg_confirm_node)
    # Confirm Registration is BACKEND-ONLY (No edge, backend webhook saves member & replies)
    # Change Wing routes back to wing_node_id
    add_edge(reg_confirm_id, wing_node_id, "Change Wing", source_handle=btn_change_wing_id)
    # Main Menu routes back to root
    add_edge(reg_confirm_id, "root", "Main Menu", source_handle=btn_main_menu_id)

    # Helper to build district pages
    def make_district_page(node_id, name, district_list, next_page_id=None, next_page_label=None, prev_node_id=None):
        rows = []
        d_row_ids = {}
        for d in district_list:
            rid = gen_id()
            d_row_ids[d] = rid
            rows.append({"id": rid, "title": d, "description": f"Maha Seva Dal - {d.replace(' District', '')}"})

        more_id = None
        if next_page_id and next_page_label:
            more_id = gen_id()
            rows.append({"id": more_id, "title": next_page_label, "description": "View more districts in Tamil Nadu"})

        page_node = {
            "nodeId": node_id,
            "type": "interactive",
            "name": name,
            "interactiveId": None,
            "keywords": [name],
            "parentNodeId": prev_node_id,
            "data": {
                "interactiveType": "list",
                "header": {"type": "text", "text": "Select Your District"},
                "body": f"Please select your district for local volunteer coordination ({name.split('—')[-1].strip()}):",
                "footer": "Tap an option below",
                "action": {
                    "button": "Select District",
                    "sections": [
                        {
                            "title": "Districts",
                            "rows": rows
                        }
                    ]
                }
            }
        }
        nodes.append(page_node)

        # Wire each district to reg_confirm_id
        for d in district_list:
            add_edge(node_id, reg_confirm_id, d, source_handle=d_row_ids[d])

        # Wire next page if present
        if next_page_id and next_page_label:
            add_edge(node_id, next_page_id, next_page_label, source_handle=more_id)

    make_district_page(dist_p1_id, "Select District — Page 1/5", districts_p1, dist_p2_id, "More Districts (2/5)", wing_node_id)
    make_district_page(dist_p2_id, "Select District — Page 2/5", districts_p2, dist_p3_id, "More Districts (3/5)", dist_p1_id)
    make_district_page(dist_p3_id, "Select District — Page 3/5", districts_p3, dist_p4_id, "More Districts (4/5)", dist_p2_id)
    make_district_page(dist_p4_id, "Select District — Page 4/5", districts_p4, dist_p5_id, "More Districts (5/5)", dist_p3_id)
    make_district_page(dist_p5_id, "Select District — Page 5/5", districts_p5, None, None, dist_p4_id)

    # -------------------------------------------------------------
    # 5. BRANCH B: SEVA WINGS & CAUSES EXPLORER
    # -------------------------------------------------------------
    wings_explorer_id = gen_id()
    exp_rows = [
        ("Legal Wing Info", "Free citizen legal clinics and human rights awareness",
         "The Legal Wing of Maha Seva Dal conducts legal literacy workshops, consumer rights assistance, and provides free legal aid to underprivileged citizens."),
        ("Medical Wing Info", "Free health checkups, blood donation camps & medicine",
         "The Medical & Health Wing mobilizes volunteer doctors, organizes blood donation drives, free eye checkup camps, and community health awareness programs."),
        ("Education Wing Info", "Child education support, scholarships & mentorship",
         "The Education & Child Welfare Wing distributes notebooks, uniforms, provides after-school tutoring for disadvantaged students, and youth career counseling."),
        ("Youth & Sports Info", "Leadership training, sports meets and fitness camps",
         "The Youth & Sports Wing empowers the next generation through athletic tournaments, leadership summits, and nation-building community initiatives."),
        ("Mahaprasadam Info", "Daily Annadanam, hunger relief & disaster food drives",
         "The Community Seva & Mahaprasadam Wing serves nutritious meals to pilgrims, hospital attendants, and organizes community relief during emergencies."),
        ("General Cadre Info", "Grassroots seva, environmental drives and logistics",
         "The General Seva Cadre is the backbone of Maha Seva Dal, participating in temple cleaning, tree plantation, elder care, and civic assistance.")
    ]

    exp_list_rows = []
    exp_row_ids = {}
    for title, desc, _ in exp_rows:
        rid = gen_id()
        exp_row_ids[title] = rid
        exp_list_rows.append({"id": rid, "title": title, "description": desc})

    wings_explorer_node = {
        "nodeId": wings_explorer_id,
        "type": "interactive",
        "name": "Explorer: Seva Wings",
        "interactiveId": root_btn_wings_id,
        "keywords": ["Seva Wings & Causes"],
        "parentNodeId": "root",
        "data": {
            "interactiveType": "list",
            "header": {"type": "text", "text": "Maha Seva Dal Wings"},
            "body": "Select any wing below to learn more about our community initiatives and voluntary service fields:",
            "footer": "Select to view details",
            "action": {
                "button": "View Wings",
                "sections": [
                    {
                        "title": "Our Seva Wings",
                        "rows": exp_list_rows
                    }
                ]
            }
        }
    }
    nodes.append(wings_explorer_node)
    add_edge("root", wings_explorer_id, "Seva Wings & Causes", source_handle=root_btn_wings_id)

    # Detailed card for each wing
    for title, _, full_body in exp_rows:
        detail_id = gen_id()
        b_join_id = gen_id()
        b_back_id = gen_id()
        btn_join_title = f"Join {title.split()[0]}"  # e.g., "Join Legal", "Join Medical" (<= 20 chars)

        detail_node = {
            "nodeId": detail_id,
            "type": "interactive",
            "name": f"Wing: {title}",
            "interactiveId": exp_row_ids[title],
            "keywords": [title],
            "parentNodeId": wings_explorer_id,
            "data": {
                "interactiveType": "button",
                "header": {"type": "text", "text": title.replace(" Info", "")},
                "body": f"{full_body}\n\nWould you like to enroll in this wing or return to main menu?",
                "footer": "Maha Seva Dal",
                "action": {
                    "buttons": [
                        {"type": "reply", "reply": {"id": b_join_id, "title": btn_join_title}},
                        {"type": "reply", "reply": {"id": b_back_id, "title": "Back to Menu"}}
                    ]
                }
            }
        }
        nodes.append(detail_node)
        add_edge(wings_explorer_id, detail_id, title, source_handle=exp_row_ids[title])
        # Join This Wing routes to District Page 1
        add_edge(detail_id, dist_p1_id, btn_join_title, source_handle=b_join_id)
        # Back to Menu routes to root
        add_edge(detail_id, "root", "Back to Menu", source_handle=b_back_id)

    # -------------------------------------------------------------
    # 6. BRANCH C: MEMBER SERVICES & HUBS
    # -------------------------------------------------------------
    services_hub_id = gen_id()
    srv_rows = [
        ("My Membership Card", "Check your membership approval status and digital ID card"),
        ("Upcoming Seva Events", "View upcoming Annadanam, camps and foundation events"),
        ("Donate to Foundation", "Contribute towards Mahaprasadam and 80G tax-exempt seva"),
        ("Book Appointment", "Schedule meeting with district or state coordinator")
    ]

    srv_list_rows = []
    srv_row_ids = {}
    for title, desc in srv_rows:
        rid = gen_id()
        srv_row_ids[title] = rid
        srv_list_rows.append({"id": rid, "title": title, "description": desc})

    services_hub_node = {
        "nodeId": services_hub_id,
        "type": "interactive",
        "name": "Member Services Hub",
        "interactiveId": root_btn_services_id,
        "keywords": ["Member Services"],
        "parentNodeId": "root",
        "data": {
            "interactiveType": "list",
            "header": {"type": "text", "text": "MSD Services Hub"},
            "body": "Access your volunteer membership card, check upcoming programs, or support our community seva initiatives:",
            "footer": "Select an option",
            "action": {
                "button": "Choose Service",
                "sections": [
                    {
                        "title": "Services & Help",
                        "rows": srv_list_rows
                    }
                ]
            }
        }
    }
    nodes.append(services_hub_node)
    add_edge("root", services_hub_id, "Member Services", source_handle=root_btn_services_id)

    # "My Membership Card" is BACKEND-ONLY (no edge; backend checks phone number in MongoDB & sends card image/text)

    # -------------------------------------------------------------
    # 7. EVENTS NODE
    # -------------------------------------------------------------
    events_node_id = gen_id()
    btn_ev_vol_id = gen_id()
    btn_ev_menu_id = gen_id()

    events_node = {
        "nodeId": events_node_id,
        "type": "interactive",
        "name": "Events: Upcoming Seva",
        "interactiveId": srv_row_ids["Upcoming Seva Events"],
        "keywords": ["Upcoming Seva Events"],
        "parentNodeId": services_hub_id,
        "data": {
            "interactiveType": "button",
            "header": {"type": "text", "text": "Upcoming MSD Programs"},
            "body": "Upcoming Maha Seva Dal Programs:\n\n1. Guru Poornima Seva Mahotsav (Mass Annadanam & Satsang)\n2. Mahashivratri Seva Camp (Medical aid & pilgrim assistance)\n3. State-wide Mega Blood Donation Drive\n\nWant to participate as a volunteer coordinator?",
            "footer": "Maha Seva Dal Events",
            "action": {
                "buttons": [
                    {"type": "reply", "reply": {"id": btn_ev_vol_id, "title": "Volunteer for Event"}},
                    {"type": "reply", "reply": {"id": btn_ev_menu_id, "title": "Return to Menu"}}
                ]
            }
        }
    }
    nodes.append(events_node)
    add_edge(services_hub_id, events_node_id, "Upcoming Seva Events", source_handle=srv_row_ids["Upcoming Seva Events"])
    # Volunteer for Event routes to district selection
    add_edge(events_node_id, dist_p1_id, "Volunteer for Event", source_handle=btn_ev_vol_id)
    add_edge(events_node_id, "root", "Return to Menu", source_handle=btn_ev_menu_id)

    # -------------------------------------------------------------
    # 8. DONATE & SUPPORT NODE (DUAL OPTION)
    # -------------------------------------------------------------
    donate_node_id = gen_id()
    btn_qr_id = gen_id()
    btn_don_menu_id = gen_id()

    donate_node = {
        "nodeId": donate_node_id,
        "type": "interactive",
        "name": "Donate: Seva Support",
        "interactiveId": srv_row_ids["Donate to Foundation"],
        "keywords": ["Donate to Foundation"],
        "parentNodeId": services_hub_id,
        "data": {
            "interactiveType": "button",
            "header": {"type": "text", "text": "Support Maha Seva Dal"},
            "body": "Maha Seva Dal Foundation relies on voluntary contributions to support:\n\n* Daily Annadanam & Hunger Relief\n* Underprivileged Children School Kits\n* Free Healthcare Camps & Medicines\n\nAll contributions are eligible for 80G Tax Exemption receipts.",
            "footer": "Maha Seva Dal Foundation",
            "action": {
                "buttons": [
                    {"type": "reply", "reply": {"id": btn_qr_id, "title": "Show Donation QR"}},
                    {"type": "reply", "reply": {"id": btn_don_menu_id, "title": "Go to Main Menu"}}
                ]
            }
        }
    }
    nodes.append(donate_node)
    add_edge(services_hub_id, donate_node_id, "Donate to Foundation", source_handle=srv_row_ids["Donate to Foundation"])
    add_edge(donate_node_id, "root", "Go to Main Menu", source_handle=btn_don_menu_id)

    # Media Node for Donation QR
    media_qr_id = gen_id()
    media_qr_node = {
        "nodeId": media_qr_id,
        "type": "media",
        "name": "Media: Official Donation QR",
        "interactiveId": btn_qr_id,
        "keywords": ["Show Donation QR"],
        "parentNodeId": donate_node_id,
        "data": {
            "mediaType": "image",
            "link": "https://mahasevadal.org/assets/qr-code.png",
            "body": "Maha Seva Dal Foundation - Official UPI QR Code.\n\nScan using any UPI App (GPay, PhonePe, Paytm, BHIM).\nUPI ID: mahasevadal@sbi\n\nTo receive an 80G tax receipt, please reply with your Transaction ID and PAN number."
        }
    }
    nodes.append(media_qr_node)
    add_edge(donate_node_id, media_qr_id, "Show Donation QR", source_handle=btn_qr_id)

    # -------------------------------------------------------------
    # 9. BOOK APPOINTMENT NODE
    # -------------------------------------------------------------
    appt_node_id = gen_id()
    btn_appt_req_id = gen_id()
    btn_appt_menu_id = gen_id()

    appt_node = {
        "nodeId": appt_node_id,
        "type": "interactive",
        "name": "Service: Appointment",
        "interactiveId": srv_row_ids["Book Appointment"],
        "keywords": ["Book Appointment"],
        "parentNodeId": services_hub_id,
        "data": {
            "interactiveType": "button",
            "header": {"type": "text", "text": "Coordinator Meeting"},
            "body": "Need to discuss a local seva project, medical camp, or legal assistance in your taluk?\n\nYou can request an appointment with the Maha Seva Dal district leadership team.",
            "footer": "Maha Seva Dal",
            "action": {
                "buttons": [
                    {"type": "reply", "reply": {"id": btn_appt_req_id, "title": "Request Meeting"}},
                    {"type": "reply", "reply": {"id": btn_appt_menu_id, "title": "Home Menu"}}
                ]
            }
        }
    }
    nodes.append(appt_node)
    add_edge(services_hub_id, appt_node_id, "Book Appointment", source_handle=srv_row_ids["Book Appointment"])
    # Request Meeting is BACKEND-ONLY (Backend sends date picker / contact details)
    add_edge(appt_node_id, "root", "Home Menu", source_handle=btn_appt_menu_id)

    # -------------------------------------------------------------
    # CONSTRUCT WACTO FLOW DICT
    # -------------------------------------------------------------
    flow = {
        "chatbot": {
            "name": "Maha Seva Dal (MSD) v1 (English)"
        },
        "nodes": nodes,
        "edges": edges,
        "manualResolution": False
    }

    return flow, keyword_dests

if __name__ == "__main__":
    flow, keyword_dests = build_msd_flow()

    # Check for keyword routing ambiguities
    ambiguities = {kw: dests for kw, dests in keyword_dests.items() if len(dests) > 1}
    if ambiguities:
        print("ERROR: Keyword routing ambiguities detected:")
        for kw, dests in ambiguities.items():
            print(f"  '{kw}' -> {dests}")
        sys.exit(1)

    # Output paths
    out_dirs = [
        r"D:\MSD-main\MSD-main\wacto",
        r"D:\MSD-main\MSD-main\outputs\wacto"
    ]
    for d in out_dirs:
        os.makedirs(d, exist_ok=True)

    out_file1 = r"D:\MSD-main\MSD-main\wacto\msd_chatbot_flow_v1_en.json"
    out_file2 = r"D:\msd_chatbot_flow_v1_en.json"

    with open(out_file1, "w", encoding="utf-8") as f:
        json.dump(flow, f, indent=2, ensure_ascii=False)
    print(f"Saved flow to: {out_file1}")

    with open(out_file2, "w", encoding="utf-8") as f:
        json.dump(flow, f, indent=2, ensure_ascii=False)
    print(f"Saved flow to: {out_file2}")

    print(f"Total Nodes: {len(flow['nodes'])}")
    print(f"Total Edges: {len(flow['edges'])}")
