import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFile, FileContext } from 'gitea-react-toolkit';
import useEffect from 'use-deep-compare-effect';
import { AppContext } from '../App.context';
import * as cv from 'uw-content-validation';

import { fetchManifest } from 'gitea-react-toolkit';
import YAML from 'js-yaml-parser';

const TargetFileContext = React.createContext();

function TargetFileContextProvider({
  validated, onValidated, onCriticalErrors, children
}) {
  const {
    state: {
      authentication, sourceRepository, targetRepository, filepath, setFilepath,
    } = {},
  } = useContext(AppContext);

  const { state: sourceFile } = useContext(FileContext);
  
  const {
    state: sourceManifestState
  } = useFile({
    config: (authentication && authentication.config),
    authentication,
    repository: sourceRepository,
    filepath: 'manifest.yaml',
    defaultContent: '',
  });
  
  const {
    state: targetManifestState
  } = useFile({
    config: (authentication && authentication.config),
    authentication,
    repository: targetRepository,
    filepath: 'manifest.yaml',
    defaultContent: '',
  });

  const getTargetFilePath = () => {
    if (sourceRepository && sourceFile && targetRepository)
    {
      console.log("--- --- --- \n\n\n TargetFile.context // getTargetFilePath");
      console.log(sourceRepository);
      console.log(sourceFile);
      console.log(targetRepository);

      const sourceManifestIdentifier = getManifestIdentifierByFilePath({manifestState: sourceManifestState, filePath: sourceFile.path});
      console.log(sourceManifestIdentifier);

      const targetFilePath = getManifestFilePathByIdentifier({manifestState: targetManifestState, identifier: sourceManifestIdentifier});
      console.log(targetFilePath);

      return targetFilePath;
    }
  };

  const getManifestFilePathByIdentifier = ({manifestState, identifier}) => {
    if (manifestState)
    {
      const manifest = YAML.safeLoad(manifestState.content);
      if (manifest.projects)
      {
        const manifestProjects = manifest.projects.filter(p =>{
          return p.identifier === identifier;
        });
        if (manifestProjects && manifestProjects.length == 1)
        {
          return manifestProjects[0].path;
        }
      }
    }
  };

  const getManifestIdentifierByFilePath = ({manifestState, filePath}) => {
    if (manifestState)
    {
      const manifest = YAML.safeLoad(manifestState.content);

      if (manifest.projects)
      {
        console.log(manifest);

        const manifestProjects = manifest.projects.filter(p =>{
          return p.path === filePath || p.path === './' + filePath;
        });
        if (manifestProjects && manifestProjects.length == 1)
        {
          const manifestProjectIdentifier = manifestProjects[0].identifier;
          console.log(manifestProjectIdentifier);

          return manifestProjectIdentifier;
        }
      }
    }
  };

  const {
    state, actions, component, components, config,
  } = useFile({
    config: (authentication && authentication.config),
    authentication,
    repository: targetRepository,
    filepath: getTargetFilePath(),
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
