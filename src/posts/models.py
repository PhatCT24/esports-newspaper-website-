from src.auth.models import embeddedUserResponse

def postEntity(post) -> dict:
    # Ensure user_id is always a string
    user_id = post.get("user_id") or post.get("userID")
    if user_id is not None and not isinstance(user_id, str):
        user_id = str(user_id)
    # Map createdAt/updatedAt to created_at/updated_at for API
    created_at = post.get("created_at") or post.get("createdAt")
    updated_at = post.get("updated_at") or post.get("updatedAt")
    return {
        "post_id": str(post['_id']),
        "title": post["title"],
        "category": post["category"],
        "subcategory": post["subcategory"],
        "description": post["description"],
        "content": post["content"],
        "image": post["image"],
        "user_id": user_id or "",
        "created_at": created_at,
        "updated_at": updated_at,
    }

def populatedPostEntity(post) -> dict:
    return {
        "post_id": str(post["_id"]),
        "title": post.get("title", ""),
        "category": post.get("category", ""),
        "subcategory": post.get("subcategory", ""),
        "description": post.get("description", ""),
        "content": post.get("content", ""),
        "image": post.get("image", ""),
        "user": embeddedUserResponse(post["user"]) if "user" in post else None,
        "createdAt": post.get("createdAt"),
        "updatedAt": post.get("updatedAt")
    }

def postListEntity(posts) -> list:
    # Accepts both a cursor and a list
    return [postEntity(post) for post in list(posts)]