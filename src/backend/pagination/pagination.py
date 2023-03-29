from typing import Any, List
import math


def get_pages_nav(total_pages, current_page):
    """Helper function to determine the next and previous pages given the current page and total number of pages."""
    next_page = None
    prev_page = None
    if current_page + 1 <= total_pages:
        next_page = current_page + 1
    if current_page - 1 >= 1:
        prev_page = current_page - 1
    return next_page, prev_page



def paginate_data(
    """Function to paginate data based on the provided page number, page size and total content."""
        data: List[dict],
        page_no:int,
        page_size:int,
        total_content:int
    ):
    total_pages = math.ceil(total_content / page_size)
    next_page, prev_page = get_pages_nav(total_pages, page_no)

    return {
        'count':total_content, # total number of items in the content
        'next_page':next_page, # next page number, if exists
        'prev_page':prev_page, # previous page number, if exists
        'results':data # paginated results
    }
