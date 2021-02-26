import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFile, FileContext } from 'gitea-react-toolkit';
import useEffect from 'use-deep-compare-effect';
import { AppContext } from '../App.context';
import * as cv from 'uw-content-validation';

const TargetFileContext = React.createContext();

function TargetFileContextProvider({
  validated, onValidated, onCriticalErrors, children
}) {
  const {
    state: {
      authentication, targetRepository, filepath, setFilepath,
    } = {},
  } = useContext(AppContext);

  const { state: sourceFile } = useContext(FileContext);
  
  const getTargetFilePath = (_filepath) => {
    return 'tn_57-TIT.tsv';
    //return "en_tn_57-TIT.tsv";
    //debugger;
  };

  const {
    state, actions, component, components, config,
  } = useFile({
    config: (authentication && authentication.config),
    authentication,
    repository: targetRepository,
    filepath: getTargetFilePath(filepath),
    onFilepath: (_fp) => {},
    defaultContent: (sourceFile && sourceFile.content),
  });

  const validate = async (langId, bookID, content) => {
    return await cv.checkTN_TSVText(langId, bookID, 'dummy', content, '',
      { checkLinkedTAArticleFlag: false, checkLinkedTWArticleFlag: false }
    );
  }

  useEffect(() => {
    if (state === undefined || state.content === undefined) {
      onValidated(false);
      //onCriticalErrors(['Validating...']);
    } else if (!validated) {
      if ( state.name.endsWith('.tsv') ) {
        const link = state.html_url.replace('/src/', '/blame/');
        let criticalNotices = [];
        let tsvFile = state.content.trimEnd();
        // Split into an array of rows
        let rows = tsvFile.split('\n');
        // Is the first row correct (must have the correct headers)
        let tsvHeader = "Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote";
        if (tsvHeader !== rows[0]) {
          criticalNotices.push([
            `${link}#L1`,
            '1',
            `Bad TSV Header, expecting "${tsvHeader.replaceAll('\t', ', ')}"`]);
        }
  
        if (rows.length > 1) {
          for (let i = 1; i < rows.length; i++) {
            let line = i + 1;
            let cols = rows[i].split('\t');
            if (cols.length < 9) {
              criticalNotices.push([
                `${link}#L${line}`,
                `${line}`,
                `Not enough columns, expecting 9, found ${cols.length}`
              ])
            } else if (cols.length > 9) {
              criticalNotices.push([
                `${link}#L${line}`,
                `${line}`,
                `Too many columns, expecting 9, found ${cols.length}`
              ])
            }
          }
        }
  
        if (criticalNotices.length > 0) {
          onCriticalErrors(criticalNotices);
        } else {
          onValidated(true);
        }
      } else {
        onValidated(true)
      }
    }
  }, [validated, onValidated, state, onCriticalErrors]);

  const context = {
    state: { ...state, validated }, // state true/false
    actions: { ...actions, validate }, // add my action
    component,
    components,
    config,
  };


  return (
    <TargetFileContext.Provider value={context}>
      {children}
    </TargetFileContext.Provider>
  );
};

TargetFileContextProvider.propTypes = {
  /** Children to render inside of Provider */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export {
  TargetFileContextProvider,
  TargetFileContext,
};
