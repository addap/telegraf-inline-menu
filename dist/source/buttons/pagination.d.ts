/**
 * Creates ButtonOptions for the paginator
 *
 * @param  totalPages  total amount of pages. Array.length is a good way to return this one.
 * @param  currentPage current page. Has to be between [1..totalPages]
 * @return returns the ButtonOptions
 */
export declare function paginationOptions(totalPages: number, currentPage: number | undefined): {
    [key: string]: string;
};
