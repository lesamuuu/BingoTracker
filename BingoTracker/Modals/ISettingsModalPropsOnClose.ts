import ISettingsProps from "./ISettingsProps";

interface ISettingsModalPropsOnClose{

    isVisible: boolean,
    storeChanges: boolean,
    saveChangesNeedResetAlert: boolean,

    settingsProps: ISettingsProps,
}

export default ISettingsModalPropsOnClose;