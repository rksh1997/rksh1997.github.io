---
title: Everything you need to know about wc command in Linux
date: "2019-09-02"
---

**wc** stands for **word count**.

It's used to count bytes, lines, characters and words in files.

# Usage
`wc [option]... [file]...`.

**wc** command accepts optional list of options and an optional list of files.

If no options where specified, **wc** will print new line, word and byte counts for the specified files.

**Example**:

Suppose we have a file called **text.txt** which contains the following text:

```txt
hello world
```

By passing **text.txt** to **wc** we get:

```bash
$ wc text.txt
1  2 12 text.txt
```

which means that we have 1 new line (\n or \n\r), 2 words and 12 bytes in **text.txt**.


If no files where specified to **wc**, it will take standard input as its input. You type what you want and then press `Ctrl + D` twice to end input.

**Example**:

```bash
$ wc
hello, world
my name is Rashad
  2       6      31
```
We have 2 new lines, 6 words and 31 bytes.

> Note that there's new line (I pressed Enter) after `Rashad` and then I pressed `Ctrl + D`.<br>If I didn't press Enter wc output would be like `1 6 30`.

# Options
You could customize **wc** output by passing it one or more of the following options:

- `-c` or `--bytes` which is used to count byte of input.

If we have a text **text.txt** file that has the following text:
```txt
I love pizza
```
```bash
$ wc -c text.txt
13 text.txt

$ wc --bytes text.txt
13 text.txt
```

- `-m` or `--chars` which is used to count characters of input.

```bash
$ wc -m text.txt
13 text.txt

$ wc --chars text.txt
13 text.txt
```

There's no difference between `-m` and `-c` if the file contains only **ASCII** characters because each **ASCII** character will take only one byte.

But they differ when there's **Unicode** characters in the file, some characters might take 2 or 4 bytes.

Read the example below in the summary.

- `-l` or `--lines` which is used to count new lines of input.

If we have a text **text.txt** file that has the following text:
```txt
hello
world
this
is
new
line
```

```bash
$ wc -l text.txt
6 text.txt

$ wc --lines text.txt
6 text.txt
```
- `-w` or `--words` which is used to count words of input.

If we have a text **text.txt** file that has the following text:
```txt
Wassup ma brothers from other mothers
```

```bash
$ wc -w text.txt
6 text.txt

$ wc --words text.txt
6 text.txt
```

- `-L` or `--max-line-length` which is used to display the length of longest line in input. 

If we have a text **text.txt** file that has the following text:
```txt
123
123456789
12345
```

```bash
$ wc -L text.txt
9 text.txt

$ wc --max-line-length text.txt
9 text.txt
```

> You can pass more than one option like `$ wc -lw text.txt` or `$ wc -l -w text.txt`.

> You can pass more than one file or a pattern like `$ wc file1 file2` or `$ wc *.txt`.

> **wc** will always print new lines count first, then words then bytes then characters no matter how you order passed options.


# Summary

## How to count words of a file in Linux?

- `wc -w filename`.
- `wc --words filename`.

## How to count new lines of a file in Linux? 

- `wc -l filename`.
- `wc --lines filename`.

## How to count characters of a file in Linux?

- `wc -m filename`.
- `wc -chars filename`.

## How to display longest line length of a file in Linux?

- `$ wc -L filename`
- `$ wc --max-line-length filename` 
  
## What is the difference between -c and -m options of wc in Linux?
## What is the difference between bytes count and characters count?
There's no difference between `-m` and `-c` if the file contains only **ASCII** characters because each **ASCII** character will take only one byte.

But they differ when there's **Unicode** characters in the file, some characters might take 2 or 4 bytes.

**For example**:

Suppose we have a file **text.txt** with the content of:
```
123456789
©¥¢
```
it has 3 non-ascii characters `©`, `¥` and `¢`.

```bash
$ wc --chars text.txt 
14 text.txt

$ wc --bytes text.txt 
17 text.txt
```

That means each of the three non-ascii characters took 2 bytes.

> 14 comes from 9 numbers, 3 non-ascii characters and 2 new lines.
