import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./github-logo.css";
import { IconActionButton } from "./icon-action-button";

library.add(faGithub);

export function GithubLogo() {
	const openRepo = () => {
		window.open(
			"https://github.com/joshnice/mapbox-deckgl-viewer",
			"_blank",
			"noopener,noreferrer",
		);
	};

	return (
		<IconActionButton
			ariaLabel="Open GitHub Repo"
			className="github-logo"
			onClick={openRepo}
		>
			<FontAwesomeIcon className="github-logo__icon" icon={["fab", "github"]} />
		</IconActionButton>
	);
}
