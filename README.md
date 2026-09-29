# shoshierossat.com

Shoshie Ross · Creative Arts Therapy. A plain HTML and CSS site: no build
step, no framework, nothing to install. Personal project, separate from
Push-Pull.

It lives here, inside `side-hustle`, but it is its own git repo. The Money
Basics repo ignores this folder (via `side-hustle/.git/info/exclude`), so none
of it can be published on themoneybasics.co.uk.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Home |
| `services.html`, `about.html`, `testimonials.html` ("Kind words"), `faqs.html` | Inner pages |
| `contact.html` | Enquiry form (sends by email via Web3Forms) |
| `privacy.html` | Privacy notice for the site and the form |
| `thanks.html`, `404.html` | Form fallback page and "page not found" |
| `assets/css/site.css` | All styling. Colours are at the top. |
| `assets/js/site.js` | Mobile menu, draft banner, form sending |
| `assets/img/` | Photos go here |
| `scripts/check_ready.py` | Go-live check (not published) |

The header and footer are repeated in every page. If a nav link changes,
change it in all of them.

## Anything still to confirm is highlighted

Text in a yellow dashed box (`class="tbc"`) is a placeholder or a fact
Shoshie hasn't confirmed yet. A banner at the bottom of each page counts
them. To list every item, page by page:

```
python scripts/check_ready.py
```

It exits with an error while anything is left, including the form key,
leftovers from the Lovable draft, and broken links. Don't point the domain at
the site until it says READY.

## Preview on this PC

```
python -m http.server 8790 --bind 127.0.0.1
```

Then open http://127.0.0.1:8790.

## Editing later

- Small wording changes: on GitHub, open the page's `.html` file, click the
  pencil, change the text between the tags, and commit. The live site updates
  in about a minute.
- Anything bigger: ask Claude in a session opened on this folder.

The repo is public (free GitHub Pages requires it). Never put anything
private in it. Enquiries never touch the repo; they go straight to email.

## Going live (one time)

The domain is attached before launch (the `CNAME` file) so Shoshie can
see her real address while the content is finished. Until launch, every
page carries a `noindex` line marked `draft: remove at launch`, so search
engines don't list the draft. Removing those lines is the launch step;
the go-live check flags them.

1. **Repo.** On github.com, signed in as `samrossppc-design`, create an empty
   public repo called `shoshierossat` (no README). Then push this folder to
   it. Commits use the personal Gmail identity already set in this repo's
   local git config, not the Push-Pull address.
2. **Pages.** Repo Settings > Pages > Deploy from a branch > `main`, `/ (root)`.
   The site appears at https://samrossppc-design.github.io/shoshierossat/
   for checking.
3. **Form.** Shoshie creates a free Web3Forms access key using the inbox
   that should receive enquiries. Paste it into `contact.html` in place of
   `REPLACE_WITH_WEB3FORMS_ACCESS_KEY`. The key is public by design: it can
   only deliver to that one inbox.
4. **Verify the domain on the account** (stops anyone else claiming it on
   GitHub): GitHub account Settings > Pages > Add a domain. It gives a TXT
   record to add at GoDaddy.
5. **GoDaddy DNS for shoshierossat.com.** Website records only:
   - Delete the two existing `A` records for `@` (`76.223.105.230` and
     `13.248.243.5`, GoDaddy's placeholder page) and turn off any GoDaddy
     forwarding or website builder on the domain.
   - Add four `A` records for `@`: `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`.
   - Change the `CNAME` for `www` to `samrossppc-design.github.io`.
   - **Leave everything else alone.** The `MX` record, both `TXT` records
     (SPF and the `NETORGFT...` one) and `autodiscover` are Shoshie's
     Microsoft 365 email. Changing them breaks her mailbox.
6. **Custom domain.** Add a file called `CNAME` containing
   `shoshierossat.com`, push, and enter the same domain in the repo's Pages
   settings. Tick "Enforce HTTPS" once GitHub has issued the certificate
   (can take up to an hour).
7. **Test.** Send a real enquiry from the live site and check it arrives.
