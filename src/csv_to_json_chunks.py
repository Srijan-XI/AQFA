import argparse
import json
import math
import os
from pathlib import Path
from typing import Optional

try:
    import pandas as pd
except ImportError:
    pd = None


def chunk_csv_to_json(
    input_csv: Path,
    output_dir: Path,
    rows_per_chunk: int = 50000,
    orient: str = "records",
    compression: Optional[str] = None,
    ensure_ascii: bool = False,
    indent: Optional[int] = None,
):
    """
    Convert a CSV file into multiple JSON files by chunking rows.

    - input_csv: Path to source CSV file.
    - output_dir: Destination folder where JSON chunks will be written.
    - rows_per_chunk: Number of rows per JSON chunk file.
    - orient: Pandas JSON orient (default 'records' for line-delimited array of objects).
    - compression: Optional compression type ('gz', 'bz2', 'zip', 'xz'); inferred by suffix if None.
    - ensure_ascii: Whether to escape non-ASCII chars.
    - indent: JSON indentation (None for compact output).
    """
    if pd is None:
        raise RuntimeError(
            "pandas is required. Please install with: pip install pandas"
        )

    if not input_csv.exists():
        raise FileNotFoundError(f"Input CSV not found: {input_csv}")

    output_dir.mkdir(parents=True, exist_ok=True)

    # Use pandas to stream in chunks to control memory for large files
    reader = pd.read_csv(input_csv, chunksize=rows_per_chunk)

    basename = input_csv.stem
    idx = 0
    total_rows = 0

    for chunk in reader:
        # Convert chunk to Python list/dict based on orient
        data = json.loads(chunk.to_json(orient=orient))

        # Determine filename
        suffix = ".json"
        if compression:
            suffix += f".{compression}"

        out_file = output_dir / f"{basename}.part{idx}{suffix}"

        # Write JSON (support optional compression based on explicit arg)
        if compression is None:
            with open(out_file, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=ensure_ascii, indent=indent)
        else:
            # Let pandas handle compression if asked via explicit type
            # Fallback: write text then compress via pandas if supported
            tmp = output_dir / f"{basename}.part{idx}.json"
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=ensure_ascii, indent=indent)
            # Re-read via pandas to write compressed consistently
            df_tmp = pd.DataFrame(data)
            df_tmp.to_json(out_file, orient=orient, compression=compression)
            try:
                tmp.unlink(missing_ok=True)
            except Exception:
                pass

        rows_written = len(chunk)
        total_rows += rows_written
        idx += 1

    return {
        "chunks": idx,
        "rows": total_rows,
        "output_dir": str(output_dir),
        "base": basename,
    }


def main():
    parser = argparse.ArgumentParser(description="Split CSV into multiple JSON chunk files")
    parser.add_argument("input_csv", type=str, help="Path to the source CSV file")
    parser.add_argument(
        "-o",
        "--output-dir",
        type=str,
        default="chunks",
        help="Directory to write JSON chunks (default: chunks)",
    )
    parser.add_argument(
        "-r",
        "--rows-per-chunk",
        type=int,
        default=50000,
        help="Rows per JSON chunk (default: 50000)",
    )
    parser.add_argument(
        "--orient",
        type=str,
        default="records",
        choices=["records", "split", "index", "columns", "values", "table"],
        help="Pandas JSON orient (default: records)",
    )
    parser.add_argument(
        "--compression",
        type=str,
        default=None,
        choices=[None, "gz", "bz2", "zip", "xz"],
        help="Optional compression for JSON output",
    )
    parser.add_argument(
        "--indent",
        type=int,
        default=None,
        help="JSON indentation level (None for compact)",
    )
    parser.add_argument(
        "--ensure-ascii",
        action="store_true",
        help="Escape non-ASCII characters in JSON",
    )

    args = parser.parse_args()

    result = chunk_csv_to_json(
        input_csv=Path(args.input_csv),
        output_dir=Path(args.output_dir),
        rows_per_chunk=args.rows_per_chunk,
        orient=args.orient,
        compression=args.compression,
        ensure_ascii=args.ensure_ascii,
        indent=args.indent,
    )

    print(
        json.dumps(
            {"status": "ok", "result": result}, ensure_ascii=False, indent=2
        )
    )


if __name__ == "__main__":
    main()
