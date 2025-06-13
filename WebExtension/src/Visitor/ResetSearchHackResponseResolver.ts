import { ITableData } from "@docsvision/web/components/table/interfaces";
import { $GridController } from "@docsvision/webclient/Generated/DocsVision.WebClient.Controllers";
import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";
import { ICommonFolderInfo } from "@docsvision/webclient/Platform/ICommonFolderInfo";
import { IFolderDataLoadingPlugin, ResponseResolveResult } from "@docsvision/webclient/Platform/IFolderDataLoadingPlugin";
import { IFolderLoadRequest } from "@docsvision/webclient/Platform/IFolderLoadRequest";
import { PluginOrder } from "@docsvision/webclient/System/PluginOrder";

export class ResetSearchHackResponseResolver implements IFolderDataLoadingPlugin {
    id: string = "ResetSearchHackResponseResolver";
    description?: string = "Отменяет сохранение последнего поиска в папке."
    order?: PluginOrder = PluginOrder.Normal;

    public constructor(private services: $GridController) {

    }

    async resolveResponse?(data: ITableData, response?: GenModels.GridViewModelEx, services?: any): Promise<void | ResponseResolveResult> {
        if (response.gridUserSettings.searchText) {
            let data = { ...response.gridUserSettings };
            data.searchText = '';
            this.services.gridController.saveGridUserSettingsData({
                folderId: response.request.folderId,
                viewId: response.request.viewId,
                instanceId: response.instanceId,
                gridUserSettings: data
            });
        }
    }

}