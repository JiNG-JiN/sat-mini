<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package saatchi
 */

?>

	</div><!-- #content -->

	<footer id="colophon" class="site-footer" role="contentinfo">
		<div class="footer-top">
			<div class="full-width cf">
				<form id="contact-us" onsubmit="return false">
					<h4>Contact Us</h4>
					<input type="text" class="name" name="name" val="" placeholder="NAME"/>
					<input type="text" class="email" name="e-mail" val="" placeholder="E-MAIL"/>
					<textarea name="message" class="message"></textarea>
					<p class="defaultText">MESSAGE</p>
					<button type="submit">SUBMIT</button>
				</form>
				<dl>
					<dt>e-Commerce</dt>
					<dd>Strategy</dd>
					<dd>Marketplaces</dd>
					<dd>Website</dd>
					<dd>Mobile</dd>
					<dd>Cross Border</dd>
					<dd class="expanded">
						Operations
						<ul>
							<li><a href="#">- Customer Service</a></li>
							<li><a href="#">- Order Management</a></li>
							<li><a href="#">- CRM</a></li>
						</ul>
					</dd>
					<dd>Design</dd>
				</dl>
				<dl class="last">
					<dt>Digital</dt>
					<dd>Strategy</dd>
					<dd>Creative & Campaigns</dd>
					<dd>Assets</dd>
					<dd class="expanded">
						Digital Marketing
						<ul>
							<li><a href="#">- Marketplaces</a></li>
							<li><a href="#">- Search</a></li>
							<li><a href="#">- Content Marketing</a></li>
							<li><a href="#">- Baidu</a></li>
							<li><a href="#">- Social Marketing</a></li>
							<li><a href="#">- WeChat</a></li>
							<li><a href="#">- Online 2 Offline</a></li>
							<li><a href="#">- Online Advertising</a></li>
							<li><a href="#">- Customer Relationship Management</a></li>
						</ul>
					</dd>
				</dl>
			</div>
		</div>
		<div class="footer-middle">
			<a class="blog" href="javascript:;">BLOG</a> / <a class="event" href="javascript:;">EVENTS</a>
		</div>
		<div class="site-info full-width cf">
            <h1>Saatchi &amp; Saatchi</h1>
        <?php if (is_active_sidebar( 'first-footer-widget-area' )):?>
        <?php dynamic_sidebar( 'first-footer-widget-area' ); ?>
        <?php endif;?>
		</div><!-- .site-info -->
	</footer><!-- #colophon -->
</div><!-- #page -->
<script>
	var Site = {
		basePath: document.body.getAttribute('data-base-url'),
		idiom: document.body.getAttribute('data-idiom'),
		userAgent: navigator.userAgent,
		platform: navigator.platform
	};
</script>
<?php wp_footer(); ?>

</body>
</html>
