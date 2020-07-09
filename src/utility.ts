'use strict';

// 汎用関数

import * as vscode from 'vscode';
import * as _ from './common';

const CONFIG_TITLE: string = 'jumpToHint';

// 設定を読み込み
export function loadUserSetting(setting: _.UserSetting): boolean {
    const editorConfig = vscode.workspace.getConfiguration('editor');
    const extensionConfig = vscode.workspace.getConfiguration(CONFIG_TITLE);

    console.log(extensionConfig.get('common.hintCharacters', ''))
    console.log(extensionConfig.get('common.hintCharacters', '').split(""))

    setting.common = {
        wordRegExp: new RegExp(extensionConfig.get('common.wordRegExp', '\\w{2,}'), 'g'),
        lineRegExp: new RegExp(extensionConfig.get('common.lineRegExp', '^\\s*$'), 'g'),
        hintChars: extensionConfig.get('common.hintCharacters', '')
            .split("")
            .filter(function (e, i, self) { return self.indexOf(e) === i; })
    }

    setting.type = {
        hintLengthType: _.HintLengthType[extensionConfig.get('type.hintLengthType', 'Variable')],
        fixedHintLength: Math.max(extensionConfig.get('type.fixedHintLength', 1), 1)
    }

    setting.ui = {
        fontFamily: extensionConfig.get('ui.fontFamily', editorConfig.get('fontFamily', '')),
        fontSize: extensionConfig.get('ui.fontSize', editorConfig.get('fontSize', 16) - 1),
        fontColor: extensionConfig.get('ui.fontColor', 'black'),
        backgroundColor: extensionConfig.get('ui.backgroundColor', 'white')
    }

    return true;
}

