import React from 'react';
import { HashLink } from 'react-router-hash-link';

// Utils
import Text from './../../utils/Text';

const FooterLayout = (props) => {
	return (
		<div className="page-part-wrapper">
			<div className="background-overlay overlay--neutral"></div>
			<div className="page-part-content">
				<div className="container">
					<div className="content-wrapper">
						<div className="l-footer">
							<hr className="l-footer_top-delimitation" />
							<div className="l-footer_top-arrow">
								<span>&nbsp;</span>
								<span>&nbsp;</span>
								<span>&nbsp;</span>
							</div>
							<div className="l-footer_item">
								<div className="content-wrapper">
									<h3 className="l-footer_item-title--special" data-website-title>
										<img src="/assets/images/favicon.png" alt="pSearch's Logo" data-logo />
										<Text path={['footer', 'basics', 'col1', 'heading']} />
									</h3>
									<span className="l-footer_item-title--special" data-website-sub>
										<Text path={['footer', 'basics', 'col1', 'subs', '1']} />
									</span>
									<span className="l-footer_item-title--special" data-website-sub>
										<Text path={['footer', 'basics', 'col1', 'subs', '2']} />
									</span>
								</div>
							</div>
							<div className="l-footer_item-group">
								<div className="l-footer_item" data-has-border>
									<div className="content-wrapper l-footer_item-summary">
										<h3 className="l-footer_item-heading">
											<Text path={['footer', 'basics', 'col2', 'heading']} />
										</h3>
										{/* <FooterLink 
											title={<Text path={['heading', 'navigation', 'linksTitles', 'forum']} />} 
											link={<Text path={['heading', 'navigation', 'links', 'forum']} />} />
										<FooterLink 
											title={<Text path={['heading', 'navigation', 'linksTitles', 'patchNotes']} />}
											link={<Text path={['heading', 'navigation', 'links', 'patchNotes']} />} />
										<FooterLink 
											title={<Text path={['heading', 'navigation', 'linksTitles', 'feedback']} />} 
											link={<Text path={['heading', 'navigation', 'links', 'feedback']} />} />
										<hr />
										<FooterLink 
											title={<Text path={['heading', 'navigation', 'linksTitles', 'signup']} />} 
											link={<Text path={['heading', 'navigation', 'links', 'signup']} />} />
										<FooterLink 
											title={<Text path={['heading', 'navigation', 'linksTitles', 'login']} />} 
											link={<Text path={['heading', 'navigation', 'links', 'login']} />} /> */}
									</div>
								</div>
								<div className="l-footer_item">
									<div className="content-wrapper">
										<FooterLink 
											title={<Text path={['footer', 'basics', 'col3', 'list', '1']} />} 
											link="#" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const FooterLink = (props) => (
	<HashLink 
		smooth 
		to={props.link} 
		className="l-footer_item-link"
	>
		<span className="l-footer_item-link_arrow fa">
			<div className="l-footer_item-link_arrow-inner">
				<span></span><span></span>
			</div>
		</span>
		<h3 className="l-footer_item-title">{props.title}</h3>
	</HashLink>
);

export default FooterLayout;