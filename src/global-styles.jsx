import { css, Global } from "@emotion/react";
import { theme } from "@gilbarbara/components";

export default function GlobalStyles() {
	return (
		<Global
			styles={css`
				*,
				*:before,
				*:after {
					box-sizing: border-box;
				}

				html {
					-webkit-font-smoothing: antialiased;
					height: 100%;
				}
			`}
		/>
	);
}
