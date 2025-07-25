def postEntity(post) -> dict:
    return{
        "post_id": str(post['_id']),
        "title": post["title"],
        "category": post["category"],
        "subcategory": post["subcategory"],
        "description": post["description"],
        "content": post["content"],
        "status": post["status"],
        "image": post["image"],
        "user_id": post["user_id"],
        "created_at": post["created_at"],
        "updated_at": post["updated_at"]
    }

def PostResponseSchema(post) -> dict:
    return{
        "post_id": post["post_id"],
        "created_at": post["created_at"],
        "updated_at": post["updated_at"]
    }

def postListEntity(posts) -> list:
    return [postEntity(post) for post in posts]