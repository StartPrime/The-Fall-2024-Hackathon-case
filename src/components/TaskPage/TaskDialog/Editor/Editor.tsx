import { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import classes from './Editor.module.scss';

export default function MyEditor() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  return (
    <Editor
      wrapperClassName={classes.wrapperClass}
      editorClassName={classes.editorClass}
      toolbarClassName={classes.toolbarClass}
      editorState={editorState}
      onEditorStateChange={setEditorState}
      placeholder="Текст..."
      localization={{
        locale: 'ru',
        translations: RussianLocalization,
      }}
    />
  );
}

const RussianLocalization = {
  'components.controls.blocktype.h1': 'h1',
  'components.controls.blocktype.h2': 'h2',
  'components.controls.blocktype.h3': 'h3',
  'components.controls.blocktype.h4': 'h4',
  'components.controls.blocktype.h5': 'h5',
  'components.controls.blocktype.h6': 'h6',
  'components.controls.blocktype.blockquote': 'Цитата',
  'components.controls.blocktype.code': 'Код',
  'components.controls.blocktype.blocktype': 'Форматирование',
  'components.controls.blocktype.normal': 'Обычный',
  'components.controls.inline.monospace': 'Моноширинное пространство',
};
