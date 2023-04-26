import { useSelectedNode } from "~/stores/useDataStore";
import { Creator } from "../Creator";
import { Data } from "../Data";
import { Person } from "../Person";
import { Relevance } from "../Relevance";
import { TwitData } from "../TwitData";
import { Twitter } from "../Twitter";

type Props = {
  isSelectedView?: boolean
}

export const View = ({isSelectedView}: Props) => {
  const selectedNode = useSelectedNode();
  
  if (isSelectedView) {
    switch (selectedNode?.type) {
      case "twitter":
        return <Twitter />;
      case "guest":
        return <Person />;
      case "data_series":
        return <Data />;
      case "tweet":
        return <TwitData />;
      default:
        return <Creator />;
    }
  }
  else {
    return <Relevance />;
  }
};
