# VSCode Jump to Hint

[![codebeat badge](https://codebeat.co/badges/244b32bb-5c46-4e45-bbcd-fd59475c0df7)](https://codebeat.co/a/shuzo-iwasaki/projects/github-com-shugh-vscode-jump-to-hint-master) [![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/shuworks.vscode-jump-to-hint.svg)](https://marketplace.visualstudio.com/items?itemName=shuworks.vscode-jump-to-hint) [![Installs](https://vsmarketplacebadge.apphb.com/installs/shuworks.vscode-jump-to-hint.svg)](https://marketplace.visualstudio.com/items?itemName=shuworks.vscode-jump-to-hint) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/shuworks.vscode-jump-to-hint.svg)](https://marketplace.visualstudio.com/items?itemName=shuworks.vscode-jump-to-hint#review-details) [![Licence](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/shuGH/vscode-jump-to-hint/blob/master/LICENSE.md)

Jump to Hint is a extention package for the Visual Studio Code to move cursor by simple and visual operation.

<!-- ![demo](https://raw.githubusercontent.com/shuGH/vscode-jump-to-hint/master/res/demo.gif) -->

## Description

This extension was inspired by Atom's Jumpy and Vim's EasyMotion.

You can jump the cursor position to any words or line heads with a hint consisting of a few letters.
By typing the hint label as it is, determine the hint to jump to.
It is very simple and easy because type in the displayed characters.

Features:

* Jump to words that match a regular expression.
* Jump to a beginning of any lines.
* The characters to use are specified.
* Two input styles can be selected.
* Color of the hint label is configurable.

## Usage

Enter command in the command palette (`Ctrl-Shift-P` or `Cmd-Shift-P`) or press keybinding.

1. Hints will be showed and you can type a character of any hints.
2. Once determined one, jump to that position.

Commands:

* `Jump to Hint: by Word`
	* Show hints at all words and hit a key to jump to one of them.
    * Keybinding: `ctrl+alt+j w`, `cmd+alt+j w`
* `Jump to Hint: by Line`
	* Show hints at all lines and hit a key to jump to one of them.
    * Keybinding: `ctrl+alt+j l`, `cmd+alt+j l`

## Configrations

Configrations of extention and examples.

* `jumpToHint.common.wordRegExp`
    * Regular expression used to identify words in jump-by-word mode.
    * Examples:
        * `\w{2,}`: Simple.
        * `([A-Z]+([a-z0-9])*)|([a-z0-9]{2,})`: Divid uppercase and lowercase.
        * `((?<=[てにをはがのともへでや、。\s\t\n])[ぁ-んァ-ン一-龥ー]{2,}?[てにをはがのともへでや、。]*)`: てにおはや句読点で区切る。

* `jumpToHint.common.lineRegExp`
    * Regular expression used to identify lines in jump-by-line mode.
    * Examples:
        * `^\s*\S+.*`

* `jumpToHint.common.hintCharacters`
    * Characters used to generate hint code. The left side character has a higher priority.
    * Examples:
        * `asdfghjkl;'`: Use center line key only.
        * `1234567890`: Use numeric key only.

* `jumpToHint.common.inputCodeStyle`
    * Input style to select hint.
    * Values:
        * `TypeEvent`: Input directly without displaying anything.
        * `InputBox`: Show a inputbox. 日本語等の入力も可能です。
    * Notes: TypeEvent style does not work if some extension registered 'type' command already, force show a inputbox.

* `jumpToHint.type.hintLengthType`
    * Type of generated hint code length.
    * Values:
        * `Fixed`: Hint code has fixed length like <text style="background-color:#FFFF66; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">aa</text> <text style="background-color:#FFFF66; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">ab</text> <text style="background-color:#FFFF66; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">ac</text>.
        * `Variable`: Hint code has variable length depending on the number of hints like <text style="background-color:#FFFF66; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">a</text> <text style="background-color:#FFFF66; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">b</text> <text style="background-color:#FFFF66; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">ab</text>.

* `jumpToHint.type.fixedHintLength`
    * [Fixed type only] Length of fixed hint code, need to greater than 1.
    * Examples:
        * `2`: <text style="background-color:#CCFF99; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">aa</text> <text style="background-color:#CCFF99; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">ab</text> <text style="background-color:#CCFF99; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">ac</text>
        * `3`: <text style="background-color:#CCFF99; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">aaa</text> <text style="background-color:#CCFF99; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">aab</text> <text style="background-color:#CCFF99; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">aba</text>

* `jumpToHint.theme.fontColor`
    * Font color of hint decoration.
    * Examples:
        * `black`: <text style="background-color:white; color:black; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">ab</text>
        * `rgb(0,0,255)`: <text style="background-color:white; color:rgb(0,0,255); fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">ab</text>

* `jumpToHint.theme.backgroundColor`
    * Background color of hint decoration.
    * Examples:
        * `teal`: <text style="background-color:teal; color:teal; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">ab</text>
        * `#800080`: <text style="background-color:#800080; color:#800080; fontWeight:normal; border-radius:2px; border: none; padding:4px 0px;">ab</text>

## Installation

Search extension in marketplace and Install.

1. In the command palette (`Ctrl-Shift-P` or `Cmd-Shift-P`) select Install Extensions.
2. Search for table formatter and select.

## Roadmap

* [ ] CJK Support.
* [ ] Support multi text-editors(tabs).
* [ ] Jump to hint by search command.

## Release Notes

The changes are written in [Changelog](https://github.com/shuGH/vscode-jump-to-hint/blob/master/CHANGELOG.md) file.

## Licence

This package is distributed under the terms of the [MIT](https://github.com/shuGH/vscode-jump-to-hint/blob/master/LICENSE.md) license.

## Special Thanks

* David L. Goldberg: [jumpy: The fastest way to jump around files and across visible panes in Atom](https://github.com/DavidLGoldberg/jumpy)
* Wayne Maurer: [vscode\-jumpy: Jumpy Extension for Visual Studio Code](https://github.com/wmaurer/vscode-jumpy)
* Luca Trazzi: [CodeAceJumper: Ace Jump extension for Visual Studio Code](https://github.com/lucax88x/CodeAceJumper)
* Long Hoang Tran: [find\-then\-jump: Vim Easymotion inspired code navigation\.](https://github.com/tranhl/find-then-jump)

## Author

[Shuzo Iwasaki](https://github.com/shuGH)

**( • ̀ω•́ )و Enjoy!**
