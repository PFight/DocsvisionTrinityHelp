import { IFolderPluginFactory } from "@docsvision/webclient/Platform/IFolderPluginFactory";
import { ResetSearchHackResponseResolver } from "./ResetSearchHackResponseResolver";
import { app } from "@docsvision/webclient/App";
import { ICommonFolderInfo } from "@docsvision/webclient/Platform/ICommonFolderInfo";

export class VisitorsFolderPluginFactory implements IFolderPluginFactory {
    id: 'VisitorsFolderPluginFactory';
    getDataLoadingPlugins(folderInfo: ICommonFolderInfo, services) {
        if (folderInfo.folderId === "cee80a7a-7c10-45b7-a8d0-7fd9f14c6db5") {
            app.webFrameSearchPanel.setExpanded(true);
        }
        return [new ResetSearchHackResponseResolver(app)]
    }
}