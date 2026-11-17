import { Download } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { RESUME_PATH } from "../constants/resume-path";

type DownloadResumeButtonProps = {
	className?: string;
};

/** Plain link to the generated PDF: no client JavaScript needed to download it. */
export function DownloadResumeButton({ className }: DownloadResumeButtonProps) {
	return (
		<Button asChild variant="default" size="sm" className={className}>
			<a href={RESUME_PATH} download>
				<Download aria-hidden />
				Download resume
			</a>
		</Button>
	);
}
