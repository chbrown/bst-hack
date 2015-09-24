all: anthology.tagged.txt

acl-anthology.bib:
	find ~/github/acl-anthology/ -name '???-????.bib' -print0 | xargs -0 cat > $@

acl-anthology.bib.json: acl-anthology.bib
	tex-cli bib-json $< > $@

citations.txt: acl-anthology.bib.json
	cat $< | jq -r .citekey | grep -v null | sort | uniq > $@

citations.aux: citations.txt acl.bst
	cat $< | sed -e "s/\(.*\)/\\\\citation\{\1\}/" > $@
	echo '\\bibstyle{acl}' >> $@
	echo '\\bibdata{acl-anthology}' >> $@

citations.bbl: citations.aux
	bibtex citations

citations.bbl.flat: citations.bbl
	# unwrap bibtex and remove empty lines separating distinct entries
	cat $< | perl -p -0 -e 's/\n  / /g' | sed '/^$$/d' > $@

anthology.tagged.txt: citations.bbl.flat
	# "render" LaTeX (partially, at least) remove ~ spacers
	cat $< | node replace.js > $@

clean:
	rm acl-anthology.bib.json citations.txt citations.aux citations.bbl citations.bbl.flat anthology.tagged.txt
