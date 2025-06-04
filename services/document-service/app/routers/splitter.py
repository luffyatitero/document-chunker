from fastapi import APIRouter

router = APIRouter()

@router.get("/splitters/config")
async def get_splitter_configurations():
    """Get available splitter types and their default configurations"""
    return {
        "splitter_types": [
            {
                "type": "recursive",
                "name": "Recursive Character Text Splitter",
                "description": "Splits text recursively by different characters, trying to keep semantically relevant content together",
                "default_separators": ["\n\n", "\n", " ", ""],
                "recommended_for": ["General text", "Articles", "Books", "Documentation"]
            },
            {
                "type": "character",
                "name": "Character Text Splitter",
                "description": "Splits text by a single character separator",
                "default_separators": ["\n"],
                "recommended_for": ["Structured text", "Lists", "Simple documents"]
            },
            {
                "type": "token",
                "name": "Token Text Splitter",
                "description": "Splits text based on token count rather than character count",
                "default_separators": None,
                "recommended_for": ["LLM processing", "Token-limited applications"]
            }
        ],
        "length_functions": [
            {
                "type": "len",
                "name": "Character Length",
                "description": "Count characters in text"
            },
            {
                "type": "tiktoken",
                "name": "Tiktoken (GPT tokens)",
                "description": "Count tokens using tiktoken encoder"
            }
        ],
        "recommendations": {
            "pdf": {
                "splitter_type": "recursive",
                "chunk_size": 1000,
                "chunk_overlap": 200,
                "length_function": "len"
            },
            "docx": {
                "splitter_type": "recursive",
                "chunk_size": 800,
                "chunk_overlap": 150,
                "length_function": "len"
            },
            "txt": {
                "splitter_type": "recursive",
                "chunk_size": 1200,
                "chunk_overlap": 200,
                "length_function": "len"
            },
            "csv": {
                "splitter_type": "character",
                "chunk_size": 2000,
                "chunk_overlap": 100,
                "length_function": "len",
                "separators": ["\n"]
            },
            "html": {
                "splitter_type": "recursive",
                "chunk_size": 1500,
                "chunk_overlap": 300,
                "length_function": "len"
            },
            "code": {
                "splitter_type": "recursive",
                "chunk_size": 800,
                "chunk_overlap": 100,
                "length_function": "len"
            }
        }
    }