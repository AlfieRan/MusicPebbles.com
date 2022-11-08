import { useProfile } from "./useProfile";
import { useEffect, useState } from "react";

export function useCustomSummary() {
    const profile = useProfile();
    const [summary, setSummary] = useState<string | undefined>(undefined);

    const customRecord: Record<string, string> = {
        "4cc5xgxzg277h0nu6r34xggzd":
            "Hi Aimee :) Your music taste is super quirky and totally not mainstream as hell.",
    };

    useEffect(() => {
        const customSummary = customRecord[profile.profile?.id ?? ""];
        if (customSummary) {
            setSummary(customSummary);
        }
    }, [profile.profile?.id]);

    return summary;
}
