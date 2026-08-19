"""Full API test script for NotesWeb backend."""
import requests
import json

BASE = 'http://127.0.0.1:8000'

def test(label, response, expect_status=None):
    status_ok = True
    if expect_status and response.status_code != expect_status:
        status_ok = False
    icon = 'PASS' if status_ok else 'FAIL'
    print(f"  {icon} {label}: {response.status_code}")
    try:
        data = response.json()
        print(f"    -> {json.dumps(data, indent=2)[:300]}")
    except:
        print(f"    -> {response.text[:200]}")
    return response

print("=" * 60)
print("NOTESWEB BACKEND — FULL API TEST")
print("=" * 60)

# 1. API Root
print("\n[1] API ROOT")
r = test("GET /api/", requests.get(f"{BASE}/api/"), 200)

# 2. Register
print("\n[2] REGISTER")
r = test("POST /api/auth/register/", requests.post(f"{BASE}/api/auth/register/", json={
    "email": "dilip@notesweb.com",
    "username": "dilip",
    "password": "TestPass123!",
    "first_name": "Dilip",
    "last_name": "Kumawat"
}), 201)

# 3. Login with email
print("\n[3] LOGIN")
r = test("POST /api/auth/login/", requests.post(f"{BASE}/api/auth/login/", json={
    "email": "dilip@notesweb.com",
    "password": "TestPass123!"
}))
tokens = r.json()
access = tokens.get('access', '')
refresh = tokens.get('refresh', '')
headers = {"Authorization": f"Bearer {access}"}
print(f"    Token received: {'YES' if access else 'NO'}")

# 4. Get profile
print("\n[4] GET PROFILE")
test("GET /api/auth/me/", requests.get(f"{BASE}/api/auth/me/", headers=headers), 200)

# 5. Token refresh
print("\n[5] TOKEN REFRESH")
test("POST /api/auth/refresh/", requests.post(f"{BASE}/api/auth/refresh/", json={"refresh": refresh}), 200)

# 6. Create notes
print("\n[6] CREATE NOTES")
r1 = test("POST /api/notes/ (DBMS)", requests.post(f"{BASE}/api/notes/", json={
    "title": "DBMS Notes",
    "content": {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 1}, "content": [{"type": "text", "text": "Database Management"}]}]}
}, headers=headers), 201)
note1_id = r1.json().get('id')

r2 = test("POST /api/notes/ (DSA)", requests.post(f"{BASE}/api/notes/", json={
    "title": "DSA Notes",
    "content": {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Arrays, Trees, Graphs"}]}]}
}, headers=headers), 201)
note2_id = r2.json().get('id')

# 7. List notes
print("\n[7] LIST NOTES")
test("GET /api/notes/", requests.get(f"{BASE}/api/notes/", headers=headers), 200)

# 8. Get single note
print("\n[8] GET SINGLE NOTE")
test(f"GET /api/notes/{note1_id}/", requests.get(f"{BASE}/api/notes/{note1_id}/", headers=headers), 200)

# 9. Auto-save (PATCH)
print("\n[9] AUTO-SAVE (PATCH)")
test(f"PATCH /api/notes/{note1_id}/", requests.patch(f"{BASE}/api/notes/{note1_id}/", json={
    "title": "DBMS Notes — Updated",
    "content": {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Updated content via auto-save"}]}]}
}, headers=headers), 200)

# 10. Favorite
print("\n[10] FAVORITE")
test(f"POST /api/notes/{note1_id}/favorite/", requests.post(f"{BASE}/api/notes/{note1_id}/favorite/", headers=headers), 200)

# 11. Filter favorites
print("\n[11] FILTER FAVORITES")
test("GET /api/notes/?is_favorite=true", requests.get(f"{BASE}/api/notes/?is_favorite=true", headers=headers), 200)

# 12. Archive
print("\n[12] ARCHIVE")
test(f"POST /api/notes/{note2_id}/archive/", requests.post(f"{BASE}/api/notes/{note2_id}/archive/", headers=headers), 200)

# 13. Filter archived
print("\n[13] FILTER ARCHIVED")
test("GET /api/notes/?is_archived=true", requests.get(f"{BASE}/api/notes/?is_archived=true", headers=headers), 200)

# 14. Trash
print("\n[14] TRASH")
test(f"POST /api/notes/{note2_id}/trash/", requests.post(f"{BASE}/api/notes/{note2_id}/trash/", headers=headers), 200)

# 15. Filter trashed
print("\n[15] FILTER TRASHED")
test("GET /api/notes/?is_deleted=true", requests.get(f"{BASE}/api/notes/?is_deleted=true", headers=headers), 200)

# 16. Restore from trash
print("\n[16] RESTORE FROM TRASH")
test(f"POST /api/notes/{note2_id}/restore-trash/", requests.post(f"{BASE}/api/notes/{note2_id}/restore-trash/", headers=headers), 200)

# 17. Search
print("\n[17] SEARCH")
test("GET /api/search/?q=DBMS", requests.get(f"{BASE}/api/search/?q=DBMS", headers=headers), 200)

# 18. Folders
print("\n[18] FOLDERS")
rf = test("POST /api/folders/", requests.post(f"{BASE}/api/folders/", json={"name": "College"}, headers=headers), 201)
folder_id = rf.json().get('id')
test("GET /api/folders/", requests.get(f"{BASE}/api/folders/", headers=headers), 200)

# 19. Tags
print("\n[19] TAGS")
rt = test("POST /api/tags/", requests.post(f"{BASE}/api/tags/", json={"name": "exam"}, headers=headers), 201)
tag_id = rt.json().get('id')
test("GET /api/tags/", requests.get(f"{BASE}/api/tags/", headers=headers), 200)

# 20. Workspaces
print("\n[20] WORKSPACES")
rw = test("POST /api/workspaces/", requests.post(f"{BASE}/api/workspaces/", json={"name": "Dilip's Space"}, headers=headers), 201)
test("GET /api/workspaces/", requests.get(f"{BASE}/api/workspaces/", headers=headers), 200)

# 21. Unauthorized access test
print("\n[21] UNAUTHORIZED ACCESS TEST")
test("GET /api/notes/ (no token)", requests.get(f"{BASE}/api/notes/"), 401)

# 22. Logout
print("\n[22] LOGOUT")
test("POST /api/auth/logout/", requests.post(f"{BASE}/api/auth/logout/", headers=headers), 200)

print("\n" + "=" * 60)
print("ALL TESTS COMPLETE")
print("=" * 60)
