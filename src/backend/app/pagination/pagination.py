import math
from typing import List

def get_pages_nav(total_pages: int, current_page: int) -> tuple[int, int]:
    """
    Generate navigation links for pagination.

    Args:
        total_pages (int): Total number of pages.
        current_page (int): The current page number.

    Returns:
        tuple[int, int]: A tuple containing the next page number and previous page number.
    """
    next_page = None
    prev_page = None
    if current_page + 1 <= total_pages:
        next_page = current_page + 1
    if current_page - 1 >= 1:
        prev_page = current_page - 1
    return next_page, prev_page

def paginate_data(data: List[dict], page_no: int, page_size: int, total_content: int) -> dict[str, any]:
    """
    Paginate a list of data.

    Args:
        data (List[dict]): The list of data to be paginated.
        page_no (int): The current page number.
        page_size (int): The number of items per page.
        total_content (int): The total number of items.

    Returns:
        dict[str, any]: A dictionary containing pagination information and paginated data.
    """
    total_pages = math.ceil(total_content / page_size)
    next_page, prev_page = get_pages_nav(total_pages, page_no)

    return {
        "count": total_content,
        "next_page": next_page,
        "prev_page": prev_page,
        "results": data,
    }

