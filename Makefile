.PHONY: test install_lcov

install_lcov:
	brew install lcov

test:
	deno test tests/lib/parsers -A --coverage=.cov/
	deno coverage --lcov --output=.cov/cov.lcov .cov
	genhtml -o .cov/html_cov .cov/cov.lcov
	open .cov/html_cov/index.html