import { AssetCategory } from "common/asset-category";
import { App, useAppType } from "./context";

export const useFolderAssetTitle = () => {
  const appType = useAppType()
  let title = 'assets';
  if (App.isWindLike(appType)) {
    title = AssetCategory.Key.getLabel(AssetCategory.Value.WindTurbine);
  } else if (appType !== 'general') {
    title = 'areas';
  }
  return title;
};
