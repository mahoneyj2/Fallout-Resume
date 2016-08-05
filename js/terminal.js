$(document).ready(function() {
	
	// Functions for registering onclick events {
	
		// Register onclick events for the main navbar
		function register_navevents(){
			$('#nav-list > li').click(function() {
				$('#nav-list > li').removeClass('active');
				$(this).addClass('active');
				selected_tab = this.id;
				if (selected_tab == current_tab){
					return;
				}
				current_tab = selected_tab;
				generateFramework(selected_tab, generatePage);
			});
		};
		
		// Register the onclick events for the embedded experience inline nav
		function register_experienceevents(){ 
			$('#experience-nav > li').click(
				function() {
					$(this).siblings().removeClass('active');
					$(this).addClass('active');
					
					var selected = this.id;
					if (current_experience == selected) {
						return;
					}
					current_experience = selected;
					$('#inner-experience-content').html(experiences[selected]);
				}
			)
		};
		
		// Register the onclick events for the embedded university inline nav
		function register_universityevents(){ 
			$('#year-nav > li').click(
				function() {
					$(this).siblings().removeClass('active');
					$(this).addClass('active');
					
					var selected_year = this.id;
					if (current_year == selected_year) {
						return;
					}
					current_year = selected_year;
					$('#module-list').html(module_results[selected_year]);
				}
			)
		};
		
		// Register the onclick events on contact page
		function register_contactevents(){
			$('#email').click(
				function() {
					$(this).parent().html("> Email - <a href=\"mailto:" + emailstart + emaildomain +"\">" + emailstart + emaildomain + "</a>");
				}
			)
			$('#phone').click(
				function() {
					$(this).html(phonestart + phoneend);
				}
			)
		};
		
		// Unbinds other events and registers the powerOn function to the button
		function buttonOn(){
			$('#power-button').unbind('click');
			$('#power-button').click(function(){
				// do a little terminal flash or something cool
				 setTimeout(powerOn,500);
			});
		};
		
		// Unbinds other events and registers the powerOff function to the button
		function buttonOff(){
			$('#power-button').prop('disabled',false);
			$('#power-button').unbind('click');
			$('#power-button').click(
				function(){
					if (!$(this).prop('disabled')){
						$(this).prop('disabled', true);
						setTimeout(
							function(){
								$('#terminal').append(power_info['shutdown']);
							}
							, 100
						);
						
						// do a little flash
						setTimeout(
							function(){
								$('#power-button-info').remove();
								$('#power-button').prop('disabled',false);
								powerOff();
							}
							, 2000
						);
					}
				}
			);
		};
		
		// Unbinds other events on the button
		function buttonDisabled(){
			$('#power-button').prop('disabled',false);
			$('#power-button').unbind('click');
			$('#power-button').click(
				function(){
						if (!$(this).prop('disabled')){
							$(this).prop('disabled', true);
							setTimeout(
								function(){
									$('#terminal').append(power_info['booting']);
								}
								, 100
							);
							// toggle off after short period
							setTimeout(
								function(){
									$('#power-button-info').remove();
									$('#power-button').prop('disabled',false);
								}
								, 1000
							);
						}
				}
			);
		};
		
	// }
	
	// Functions for generating Frameworks and Page information {
	
		// Generates the divs of each page and callbacks on the page generating function
		function generateFramework(tab,callback){
			document.getElementById("inner-terminal-content").innerHTML = framework[tab];
			callback(tab);
		}
		
		// Generates the main nav bar for the page, callback to register events
		function generateNav(callback){
			document.getElementById("terminal").innerHTML = framework["terminal"];
			document.getElementById("terminal-content").innerHTML = framework["nav"];
			callback(current_tab);
		}
		
		// Generates the page using the typerfunction which simulates typing
		function generatePage(tab){
			if (tab == "education"){
				typerfunction(defaultuniversity, 'university', 2, register_universityevents)();
				typerfunction(alevels, 'alevel',10)();
				typerfunction(gcses, 'gcses',10)();
			} 
			else if (tab == "about"){
				typerfunction(about, 'about-info',5)();
				typerfunction(biography, 'biography', 5)();
			}
			else if (tab == "contact"){
				typerfunction(contact, 'contact-info',5,register_contactevents)();
			}
			else if (tab == "experience"){
				typerfunction(defaultexperience, 'experience-content', 1, register_experienceevents)();
			}
			else if (tab == "projects"){
				
			}
			else if (tab == "loading"){
				fillLoadingBar(34,100)();
				typerfunction(terminal_info, 'terminal-info', 10)();
				typerfunction(boot_text,'boot-loading', 10)();
				typerfunction(boot_progress, 'boot-progress',100, loadSplashScreen)();
			}
			else if (tab == "splash"){
				typerfunction(splash_text, "splash-text",50)();
			}
		};
		
		// Loads the splash screen after a delay, then loads the initial page ("about") 
		function loadSplashScreen(){
				setTimeout(function(){
					generateFramework("splash", generatePage)
					},1500);
				setTimeout(initialisePage, 4000);
		};
		
		// Initialises the page on the main site, after loading
		function initialisePage(){
			current_tab = "about";
			generateNav(register_navevents);
			generateFramework(current_tab, generatePage);
			// Enable button again
			buttonOff();
		};
	
	// }
	
	// Pretty misc functions {
		
		// Generates a typing function with relevant html & div information, and callback for event registering
		function typerfunction(html, id, delay, callback){
			var i = 0;
			var runbefore = false;
			var isTag = false;
			return function type() {
				if (runbefore) {
					runbefore=false;
					i=0;
				}
				text = html.slice(0, ++i);
				var element = document.getElementById(id);
				
				if (!element){
					// element was removed
					return;
				}
				
				element.innerHTML = text;

				if (text === html) {
					runbefore=true;
					if (callback) callback();
					return;
				}
			
				var char = text.slice(-1);
				if( char === '<' ) isTag = true;
				if( char === '>' ) isTag = false;

				if (isTag) return type();
				setTimeout(type, delay);
			};
		};
		
		// Fills loading bars on the page with a parameter size and delay
		function fillLoadingBar(size,delay){
			var i = 0;
			var spaces = "";
			var bar = ">";
			for (var j = 0; j < size-1; j++){
				spaces += ' ';
			}
			return function loading(){
				var string = "["+ bar + spaces + "]";
				if (i == size){
					bar = bar.slice(0,-1);
					string = "[" + bar + "]";
					$(".loading-bar").html(string);
					return;
				}
				$(".loading-bar").html(string);
				bar = "=" + bar;
				spaces = spaces.slice(0,-1);
				i++;
				setTimeout(loading, delay)
			};
		};
	
	// }
	
	// Page constructors / destructors {
	
		// Initiates the page loading process, changing bg and generating framework
		function powerOn(){
			
			//Change background image
			
			
			//Disable button until loaded
			buttonDisabled();
			
			//Load boot sequence
			generateFramework("loading", generatePage);
		};
		
		// Returns the page to the 'off' state, resetting HTML changes and changing bg
		function powerOff(){
			
			//Change background image
			
			
			//Generate empty terminal
			$('#terminal').html(framework['empty']);
			
			//Change button to powerOn
			buttonOn();
		};
		
	// }
		
	// Actual execution
	
	buttonOn();
	
	// global variables for page information
	var current_year = "total";
	var current_tab = "about";
	var current_experience = "warwicktech";
	
	// Framework, page and general HTML information
	
	var power_info = {
		'shutdown' : "\
			<div id=\"power-button-info\">\
				<a class=\"awaiting\">SHUTTING DOWN</a>\
			</div>",
		'booting' : "<div id=\"power-button-info\">\
				<a class=\"awaiting\">DO NOT POWER IN BOOT</a>\
			</div>"
	}
	// Education page text
	var module_results = {
		'year1': 				 " \
				<li>FIRST CLASS HONOURS - 78.3\%</li> \
				<li>-------------------------------------------</li> \
				<li>MODULE RESULTS</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs118/\">Programming for Computer Scientists</a> - 83%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs126/\">Design of Information Structures</a> - 79%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs130/\">Maths for Computer Scientists I</a> - 78\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs131/\">Maths for Computer Scientists II</a> - 62\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs132/\">Computer Organisation & Architecture</a> - 81\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs133/\">Professional Skills</a> - 72\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs134/\">Computer Security</a> - 83\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs139/\">Web Development Technologies</a> - 88\%</li>",
		'year2': " \
				<li>FIRST CLASS HONOURS - 78.7\%</li> \
				<li>-------------------------------------------</li> \
				<li>MODULE RESULTS</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs241/\">Operating Systems and Networks</a> - 83%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs256/\">Functional Programming</a> - 65\% </li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs349/\">Advanced Computer Architecture</a> - 86\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs258/\">Database Systems</a> - 88\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs259/\">Formal Languages</a> - 78\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs260/\">Algorithms</a> - 69\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs261/\">Software Engineering</a> - 74\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs262/\">Logic and Verification</a> - 86\%</li>",
		'year3': " \
				<li>FIRST CLASS HONOURS - 78.3\%</li> \
				<li>-------------------------------------------</li> \
				<li>MODULE RESULTS</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs325/\">Compiler Design</a> - 91%</li> \
				<li>> <a href=\"\">3rd Year Project</a> - 72\% </li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs349/\">Principles of Programming Languages</a> - 93\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs342/\">Machine Learning</a> - 84\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs346/\">Advanced Databases</a> - 66\%</li> \
				<li>> <a target=\"\_blank\" href=\"https://www2.warwick.ac.uk/fac/sci/dcs/teaching/modules/cs313/\">Mobile Robotics</a> - 81\%</li> \
				<li>> <a target=\"\_blank\" href=\"http://www2.warwick.ac.uk/services/aro/dar/quality/modules/ib382/\">Project Management</a> - 67\%</li> \
				<li>> </li>",
		'year4': "TO BE CONFIRMED ...",
		'total': " \
				<li><pre>[========================>        ]</pre></li> \
				<li>CURRENT STATUS - <a class=\"awaiting\">IN PROGRESS (YEAR 4)</a></li> \
				<br> \
				<li>AVERAGE MARK - 78.43%</li> \
				<br> \
				<li>MODULE GRADES:</li> \
				<li>1st - 18</li> \
				<li>2.1 - 5</li> \
				<li>2.2 - 0</li>"
	};
	
	var alevels = "<p>The Judd School<br><br>A-Levels <br>Maths (A) Chemistry (A*) <br>Physics (A) Economics (B)</p>";
	
	var gcses= "<p><br><br>GCSEs<br>7A* (Maths, 3 Sciences), 2A <br>(English), 1B (DT)</p>";
	
	var defaultuniversity = "\
					EDUCATION \
					<p> \
						University of Warwick - Computer Science MEng \
					</p> \
					<ul id=\"year-nav\" class=\"inline-nav\"> \
						<li id=\"year1\" class=\"success\">[YEAR 1]</li> \
						<li id=\"year2\" class=\"success\">[YEAR 2]</li> \
						<li id=\"year3\" class=\"success\">[YEAR 3]</li> \
						<li id=\"year4\" class=\"awaiting\">[YEAR 4]</li> \
						<li id=\"total\" class=\"awaiting active\">[TOTAL]</li> \
					</ul> \
					<ul id=\"module-list\">"
					+ module_results['total'] +"</ul>";
	
	var experiences = {
		'warwicktech' : "\
					<div id=\"warwicktech\" class=\"terminal-full-column\">\
						<a target=\"_blank\" href=\"http://warwick.tech\">WarwickTECH society</a>\
						<p>\
							Lead Technical (2014-2016)\
						</p>\
						<p> Founded in 2014, WarwickTECH is a BCS accredited student society at Warwick University \
							which focuses on developing a platform for entrepeneurs and tech innovators through our \
							through our large variety of events.\
						</p>\
						Responsibilities included (but not limited to)\
						<ul>\
							<li>> Creating and maintaining a variety of web resources</li>\
							<li>> Organising and running our multiple Hackathon events</li>\
							<li>> Mentoring at Coding workshops<li>\
						</ul>\
						<p>\
							Come check us out!\
							<ul>\
								<li><a target=\"_blank\" href=\"https://www.facebook.com/warwicktech\">Facebook</a></li>\
								<li><a target=\"_blank\" href=\"https://www.linkedin.com/company/warwicktech\">LinkedIn</a></li>\
							</ul>\
						</p>\
					</div>",
		'internship' : "",
		'university' : "",
		'misc' : ""
	};

	
	var defaultexperience = "\
					EXPERIENCE \
					<ul id=\"experience-nav\" class=\"inline-nav\">\
						<li id=\"warwicktech\" class=\"active success\">[WARWICKTECH]<li>\
						<li id=\"internship\" class=\"success\">[INTERNSHIPS]</li>\
						<li id=\"university\" class=\"success\">[UNIVERSITY]</li>\
						<li id=\"misc\" class=\"success\">[MISC]</li>\
					</ul>\
					<div id=\"inner-experience-content\">" 
					+ experiences[current_experience] + "</div>";
	
	var contact = "					CONTACT\
						<p>\
							Noone likes getting their details taken by webcrawlers! <br>\
							Just click the links below to reveal the information!\
						</p>\
						<ul>\
							<li>> Email - <a id=\"email\" href=\"javascript:void(0)\">CLICK HERE</a></li>\
							<li>> Phone - <a id=\"phone\" href=\"javascript:void(0)\">CLICK HERE</a></li>\
						</ul>\
						<ul>\
							<li>OTHER LINKS</li>\
							<li>> <a target=\"_blank\" href=\"https://github.com/mahoneyj2\">GitHub</a></li>\
							<li>> <a target=\"_blank\" href=\"https://www.facebook.com/jamie.mahoney.12\">Facebook</a></li>\
						</ul>\
						<p>\
						Wubba, lubba, dub, dub!\
						</p>";
					
	var about = "\
					ABOUT ME\
						<p>\
							James H. J. Mahoney\
						</p>\
						<ul>\
							<li>CURRENT STATUS</li>\
							<li>> 4th year Computer Science student @ <a target=\"_blank\" href=\"https://www2.warwick.ac.uk/\">Warwick University</a></li>\
							<li>> Technical lead for <a target=\"_blank\" href=\"http://warwick.tech\">WarwickTECH</a><li>\
							<li>> Currently interning in Development @ <a target=\"_blank\" href=\"http://etech.net/\">eTech</a> </li>\
							<li><br></li>\
							<li class=\"success\">> Looking for job opportunities in Software Engineering</li>\
						</ul>";
						
	var biography = "\
						BIOGRAPHY\
						<p>\
						I\'m a hard working Computer science student with a passion for my subject.\
						I enjoy a challenge - motivated by a passion for finding solutions & solving problems efficiently.\
						</p>\
						<ul>\
							<li>Here\'s my CV, so hire me, maybe?</li>\
							<li>> <a target=\"_blank\" href=\"http://warwick.tech\">Resume PDF</a><li>\
							<li>> <a target=\"_blank\" href=\"https://github.com/mahoneyj2\">GitHub</a> </li>\
						</ul>";
	var terminal_info = "ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM\
						<br>\
						COPYRIGHT 2075-2077 ROBCO INDUSTRIES";
						
	var boot_text = "	<ul id=\"boot-text\">\
							<li>LOADING KERNEL</li>\
							<li>PROBING SYSTEM</li>\
							<li>LOADING DRIVERS</li>\
							<li>LOADING CORE</li>\
							<li>BOOTING</li>\
						</ul>";
						
	var boot_progress = "<li>✓</li>\
						<li>✓</li>\
						<li>✓</li>\
						<li>✓</li>\
						<li>✓</li>";
						
	var splash_text = "Welcome USER!";
	
	//obscure contact details from lil webcrawlers
	var emailstart = "j.h.j.mahoney";
	var emaildomain = "@warwick.ac.uk";
	var phonestart = "07561";
	var phoneend = "809893";
	
	// The div information for generating each pages framework
	var framework = {
		'about' : "<div id=\"about-info\" class=\"terminal-full-column\"></div>\
				   <div id=\"biography\" class=\"terminal-full-column\"></div>",
		'education' : "\
		<div id=\"university\" class=\"terminal-full-column\"></div> \
		<div id=\"alevel\" class=\"terminal-half-column\"></div> \
		<div id=\"gcses\" class=\"terminal-half-column\"> \
		",
		'experience' : "<div id=\"experience-content\" class=\"terminal-full-column\"></div>",
		'projects' : "",
		'contact' : "\
					<div id=\"contact-info\" class=\"terminal-full-column\"></div>",
		'loading' : "\
				<div class=\"terminal-splash\"> \
					<div id=\"terminal-info\">\
					</div>\
					<div id=\"boot-sequence\">\
						<div id=\"boot-loading\">\
						</div>\
						<div id=\"boot-ticks\">\
							<ul id=\"boot-progress\">\
							</ul>\
						</div>\
						<p class=\"loading-bar\">[                                      ]</p>\
					</div>\
				</div>",
		'splash' : "\
				<div class=\"terminal-splash\">\
					<div id=\"terminal-info\">\
						ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM\
						<br>\
						COPYRIGHT 2075-2077 ROBCO INDUSTRIES\
					</div>\
					<pre>"+
"\n" + 
"\n" + 
"\n" +
"\n" +
"           ____        __    __________     __  ______  _____\n" + 
"          / __ \\____  / /_  / ____/ __ \\   / / / / __ \\/ ___/\n" + 
"         / /_/ / __ \\/ __ \\/ /   / / / /  / / / / / / /\\__ \\ \n" + 
"        / _, _/ /_/ / /_/ / /___/ /_/ /  / /_/ / /_/ /___/ / \n" + 
"       /_/ |_|\\____/_.___/\\____/\\____/   \\____/\\____//____/  \n" + 
"\t   \n"
					+"</pre>\
					<div id =\"splash-text\" class = \"terminal-center-text\">\
					</div>\
				</div>",
		'nav' : " \
				<div id=\"terminal-nav\">\
					<ul id=\"nav-list\">\
						<li id=\"about\" class=\"active\">[ABOUT ME]</li>\
						<li id=\"education\" class=\"\">[EDUCATION]</li>\
						<li id=\"experience\" class=\"\">[EXPERIENCE]</li>\
						<li id=\"projects\"class=\"\">[PROJECTS]</li>\
						<li id=\"contact\" class=\"\">[CONTACT]</li>\
					</ul>\
				</div>\
				<div id=\"inner-terminal-content\">\
				\
				</div>",
		'terminal' : "\
			<div id=\"terminal-info\">\
				ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM\
				<br>\
				COPYRIGHT 2075-2077 ROBCO INDUSTRIES\
			</div>\
			<div id=\"terminal-content\">\
				<div id=\"inner-terminal-content\">\
				</div>\
			</div>",
		'empty' : "	\
			<div id=\"terminal-content\">\
				<div id=\"inner-terminal-content\"></div>\
			</div>"
	};
});