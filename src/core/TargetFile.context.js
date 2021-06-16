import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFile, FileContext } from 'gitea-react-toolkit';
import { AppContext } from '../App.context';

const TargetFileContext = React.createContext();

function TargetFileContextProvider({
  onOpenValidation, children
}) {
  const {
    state: {
      authentication, targetRepository, filepath, setFilepath,
    } = {},
  } = useContext(AppContext);

  const { state: sourceFile, actions: sourceFileActions } = useContext(FileContext);

  // const targetFileCachedContentFile = loadCacheTargetFile();
  // console.log("cachedContent");
  // console.log(targetFileCachedContentFile);
  
  console.log("tc create // target file // defaultContent");
  console.log(sourceFile);
  console.log(sourceFileActions.onLoadCache);
  console.log(sourceFileActions.onSaveCache);

  const {
    state, actions, component, components, config,
  } = useFile({
    config: (authentication && authentication.config),
    authentication,
    repository: targetRepository,
    filepath,
    onFilepath: setFilepath,
    defaultContent: (sourceFile && sourceFile.content),
    onOpenValidation: onOpenValidation,
    // Pass cache actions from the app's FileContext (happens to be SOURCE).
    // Sharing actions allows the app to use onCacheChange events.
    onLoadCache: sourceFileActions.onLoadCache,
    onSaveCache: sourceFileActions.onSaveCache,
  });

  const context = {
    state: { ...state }, 
    actions: { ...actions }, 
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
