export interface PagedResult<ClinicalTrial> {
    items: ClinicalTrial[];
    totalCount: number;
    page: number | null;
    pageSize: number | null;
    totalPages: number | null;
}
