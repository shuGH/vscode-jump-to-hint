'use strict';

// 汎用関数

import {
    workspace,
    commands
} from 'vscode';
import * as _ from './common';

const CONFIG_TITLE: string = 'jumpToHint';

// 設定の読み込み
export function getUserSetting(): _.UserSetting {
    let setting: _.UserSetting = {
        common: {
            wordRegExp: new RegExp(''),
            lineRegExp: new RegExp(''),
            hintCharList: [],
            inputStyle: _.InputStyle.InputBox
        },
        type: {
            hintLengthType: _.HintLengthType.Variable,
            fixedHintLength: 2,
        },
        theme: {
            fontColor: '',
            backgroundColor: ''
        }
    };

    const editorConfig = workspace.getConfiguration('editor');
    const extensionConfig = workspace.getConfiguration(CONFIG_TITLE);

    setting.common = {
        wordRegExp: new RegExp(extensionConfig.get('common.wordRegExp', '\\w{2,}'), 'g'),
        lineRegExp: new RegExp(extensionConfig.get('common.lineRegExp', '^\\s*$'), 'g'),
        hintCharList: extensionConfig.get('common.hintCharacters', '')
            .split("")
            .filter(function (e, i, self) { return self.indexOf(e) === i; }),
        inputStyle: _.InputStyle[extensionConfig.get('common.inputStyle', 'InputBox')]
    }

    setting.type = {
        hintLengthType: _.HintLengthType[extensionConfig.get('type.hintLengthType', 'Variable')],
        fixedHintLength: Math.max(extensionConfig.get('type.fixedHintLength', 1), 1)
    }

    setting.theme = {
        fontColor: extensionConfig.get('theme.fontColor', 'black'),
        backgroundColor: extensionConfig.get('theme.backgroundColor', 'white')
    }

    return setting;
}

// ステートの更新
export function updateState(status: _.ExtensionStatus, state: _.ExtensionState) {
    status.state = state;
    // 独自Contextの設定
    let f = (state == _.ExtensionState.NotActive) ? false : true;
    commands.executeCommand('setContext', 'jumpToHint.enabled', f);
}
