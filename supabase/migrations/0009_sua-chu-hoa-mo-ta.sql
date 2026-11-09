-- 0009: fix lowercased acronyms in the descriptions added by 0008 ("pLC" → "PLC", "cB" → "CB").
-- Safe to run more than once; only touches text that still has the wrong spelling.
update public.products
set summary = replace(replace(summary, 'cấp pLC', 'cấp PLC'), 'cấp cB ', 'cấp CB '),
    description = replace(replace(description, 'cấp pLC', 'cấp PLC'), 'cấp cB ', 'cấp CB ')
where summary like '%cấp pLC%' or summary like '%cấp cB %' or description like '%cấp pLC%' or description like '%cấp cB %';
