import React from "react";
// Components
// Utils
import CustomFieldSelect from "./../components/app/utils/CustomFieldSelect";

class LangSelect extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<section className="page-content">
				<div id="packed" className="packed"></div>
				<div className="page-part-wrapper">
					<div className="background-overlay webp-test overlay--horizon-zero-dawn"></div>
					<div className="page-part-content all-page-size">
						<div className="content-wrapper">
							<h1><i className="fa"></i> Language</h1>
							<hr />
							<form action="" method="POST">
								<fieldset>
									<CustomFieldSelect 
										id="1"
										class="dark"
										name="lang"
										options=
										{
											{
												none: "Select yours",
												fr: "Français",
												en: "English"
											}
										}
										autoClose={true}
									/>
									<button type="submit" className="button--icon button--dark button--check fa-2x"></button>
								</fieldset>
							</form>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

export default LangSelect;