import { ref, Ref } from "vue";

export default function useTabs (defaultTab: string){
    const activeTab = ref(defaultTab);
    const tabChange = (tab: string) => activeTab.value = tab;
  return { activeTab, tabChange, isOpen: (tab: string) => activeTab.value == tab };
}
