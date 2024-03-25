Summary

=========

## BR

Brotli usually gets the best compression ratio for JSON, readme, html files, etc. but usually at the cost of speed. It
is usually fast enough, but can choke on very large paylaods.

## Snappy

Lives up to the name - is always fastest operation - and starts to choke on large payloads around character count of
`4e7` which is shown in the `recoders.bench.ts` file.

## GZIP / GZlib

Sturdiest, longest-lived gold standard

## ZSTD

New, middle balanced, very fast, very good compression ratio lib, binary format is not the same as a gz

# External Considerations

- For AWS S3 Select - you can [compress a parquet columns][aws-s3-select] within the object using `Snappy` or `GZIP` or you can read data subsets stored in CSV or JSON record files.
- Also for AWS S3 Select - you can [compress a CSV or JSON file][aws-s3-select-doc] usiung `GZIP` or `BZIP2`


<!-- Ref Links -->

- [aws-s3-select-parquet]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/selecting-content-from-objects.html#selecting-content-from-objects-requirements-and-limits
- [aws-s3-select-doc]: https://docs.aws.amazon.com/AmazonS3/latest/API/API_SelectObjectContent.html#API_SelectObjectContent