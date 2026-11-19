# Croatian price display review — 19 November 2026

This records the sources and implementation decisions for AuraTerm's service price list.
It is a technical implementation review, not a legal opinion on every aspect of the business.

## Applicable rules

- The owner's linked [NN 101/2026-1213](https://narodne-novine.nn.hr/clanci/sluzbeni/2026_09_101_1213.html) established the earlier publication rules. [NN 110/2026-1310](https://narodne-novine.nn.hr/clanci/sluzbeni/full/2026_09_110_1310.html) only postponed their commencement to 17 November 2026. [NN 132/2026-1580](https://narodne-novine.nn.hr/clanci/sluzbeni/2026_11_132_1580.html) expressly repealed that decision, as amended, effective 17 November 2026. Consequently the earlier 08:00 deadline and 30-day retention period are not the basis of this current implementation; the rules below specify 11:00 and 15 days after replacement.
- [NN 132/2026, regulation 1583](https://narodne-novine.nn.hr/clanci/sluzbeni/2026_11_132_1583.html), effective 17 November 2026: the general reference date for services is 10 September 2026. Later introductions use their first-offer price. Special-sale rules can require a preceding non-discounted price. Service baselines must appear beside the retail price and be clearly distinguishable. There are exceptions, including qualifying personalised/dynamic prices; they do not automatically exempt standard installation packages. The statement that every advertised web price always needs a baseline is broader than the regulation: article 7 distinguishes printed/TV advertising from other advertising. This website nevertheless includes an actual service price list.
- [NN 132/2026, regulation 1584](https://narodne-novine.nn.hr/clanci/sluzbeni/2026_11_132_1584.html): publish service name, current retail price and special-sale information, then baseline price, in UTF-8 CSV/XML. CSV uses semicolons. Update by 11:00 on the change date at the same URL. Retain replaced price lists online for 15 days. Filenames contain the business identifier, location information (or `ZA_SVA_PRODAJNA_MJESTA` for one common list), service designation, storage number, and publication timestamp `YYYYMMDD_HHMM`.
- [NN 59/2026, amendment 728](https://narodne-novine.nn.hr/clanci/sluzbeni/2026_06_59_728.html): the retail price is the final price including taxes and public charges. Therefore the prominent displayed amounts include VAT; the net amounts are labelled separately.

## Price sources and confirmations

- The requested 2025 file was absent. The owner confirmed using `Cjenik usluga 2026.docx`.
- The document contains 16 priced services: 3 installation bands and 13 other services. The two incomplete trailing mono-split rows have no numerical prices and are not additional priced services.
- The owner confirmed the document prices applied on 10 September 2026. Current and baseline amounts are deliberately stored separately even when equal. Do not update baseline values automatically when current prices change.
- The document does not list multi-split. The owner instructed retaining the current prices with 25% VAT in response to the baseline question. Implementation interprets this as retaining €200/€180 net, or €250/€225 gross, for both current and baseline amounts. Confirm this interpretation before publication if the September multi-split rates differed.
- Every gross/net pair in the document uses 25% VAT. Service names have only typographical/spacing corrections; prices and charge units are preserved.
- No special sale is advertised. Equal current/baseline values are not presented as discounts.
- Reviews, email delivery, and package inclusions are unchanged by this pricing update.

## Publishing and maintaining the CSV

The owner verified company OIB `97293632292` and confirmed that there is only one location. The common price list therefore uses `ZA_SVA_PRODAJNA_MJESTA`. The company details also match [Fininfo](https://www.fininfo.hr/Poduzece/Pregled/auraterm/Detaljno/950464) and [CompanyWall](https://www.companywall.hr/tvrtka/auraterm-jdoo/MMUWGvSC), both listing AURATERM j.d.o.o. at Kralja Zvonimira 1, Karlovac. The first release is prepared locally with timestamp `20261119_2037` (Europe/Zagreb); it has not been deployed. Adjust that timestamp to the actual publication time before deployment if needed.

1. Enter the confirmed OIB and location in `data/price-list-publication.json`. For a common price list at all locations, use `ZA_SVA_PRODAJNA_MJESTA`; otherwise include the applicable location classification, address, and identifier in the filename segment.
2. Set `publishedAt` to the planned deployment time in Europe/Zagreb (`YYYYMMDD_HHMM`). On later changes increment `revision` and set a new publication timestamp.
3. Run `npm run prices:update`, then `npm test` and `npm run build`. Commit the generated CSV files and archive manifest with the pricing change and deploy on the intended date. If deployment is rescheduled, update the publication metadata before releasing.
4. `/cjenik.csv` is the stable current URL. Its download filename carries the required metadata. Named release copies are in `public/cjenici`; the pricing page links to superseded copies. The update script refuses to overwrite an existing release with different prices.
5. Keep previous releases deployed for at least 15 days after replacement. The implementation retains them indefinitely. Git history alone is not a publicly accessible archive.

The separate `/cjenik-excel.csv` download adds an Excel separator hint (`sep=;`) after the UTF-8 BOM so direct opening does not depend on the Windows list separator. The standard `/cjenik.csv` and its archived copies remain regular semicolon-delimited CSV with the column header as the first row. Both downloads are generated from the same prices by `npm run prices:update`.

The Word document and a copy of today's website do not independently establish historical prices. The baseline values here rely on the owner's confirmations above. The generated CSV and the price-list download use the verified business metadata.

## Verification of the owner's linked decisions — 19 November 2026

Conclusion: the checked local implementation supports the current publication requirements, but full live/business compliance has not been established.

- Local HTTP checks returned 200 for `/pricing`, `/cjenik.csv`, and the named release in `/cjenici/`. The pricing page links to the standard machine-readable file. It contains a header and 18 service rows, uses UTF-8 and semicolons, and excludes the Excel-only `sep=;` directive. The stable URL supplies the metadata filename through Content-Disposition.
- All 14 existing automated tests passed, including price/VAT arithmetic, baseline presence, CSV escaping, and agreement between website data and generated files. These are technical checks, not proof of historical transactions or complete business inventory.
- All services currently declare no special sale. Introducing a promotion requires updating the data/export logic, which currently hardcodes that state.
- The sole-location/common-list filename uses the owner's verified OIB and the common-list exception in article 6(4) of NN 132/2026-1584. Its prepared publication timestamp must match actual publication; a local preparation date is not evidence of deployment.
- Archive generation preserves prior files and the page lists superseded releases. Actual availability for at least 15 days after replacement and publishing changes by 11:00 require the operator to regenerate and deploy on time; the app does not schedule deployments.
- The 16 document-derived baselines rely on the owner's date confirmation. The two multi-split historical amounts remain an interpretation of the instruction to retain current prices with 25% VAT, as recorded above. The code cannot establish whether the baseline date involved a special sale or whether additional standard services/products need publication.
- Live verification was unsuccessful: the web tool could not access the public URLs, and a direct HTTPS request to both `https://auraterm.hr/pricing` and `https://auraterm.hr/cjenik.csv` failed certificate-chain verification (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`). This does not establish their HTTP status or prove a universal outage. Verify the public TLS chain, unauthenticated automated downloads, deployment contents, and release timestamp before treating the live publication obligation as fulfilled.
