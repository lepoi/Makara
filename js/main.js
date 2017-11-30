$( function() {
	$( "#boot-time" ).slider({
		min: 0,
		max: 100,
		value: 0,
		slide: function( event, ui ) {
			$( "#display-boot-time" ).val( ui.value );
		}
	});
	$( "#display-boot-time" ).val( $( "#boot-time" ).slider( "value" ) );
});
$( function() {
	$( "#scheduling-time" ).slider({
		min: 1,
		max: 50,
		value: 5,
		slide: function( event, ui ) {
			$( "#display-scheduling-time" ).val( ui.value );
		}
	});
	$( "#display-scheduling-time" ).val( $( "#scheduling-time" ).slider( "value" ) );
});
$( function() {
	$( "#new-process-prob" ).slider({
		min: 0,
		max: 100,
		value: 50,
		slide: function( event, ui ) {
			$( "#display-prob" ).val( ui.value );
		}
	});
	$( "#display-prob" ).val( $( "#new-process-prob" ).slider( "value" ) );
});
$( function() {
	$( "#quantum-cycles" ).slider({
		min: 1,
		max: 50,
		value: 7,
		slide: function( event, ui ) {
			$( "#display-quantum-cycles" ).val( ui.value );
		}
	});
	$( "#display-quantum-cycles" ).val( $( "#quantum-cycles" ).slider( "value" ) );
});
$( function() {
	$( "#proc-cycles" ).slider({
		min: 0,
		max: 30,
		value: 15,
		slide: function( event, ui ) {
			$( "#display-proc-cycles" ).val( ui.value );
		}
	});
	$( "#display-proc-cycles" ).val( $( "#proc-cycles" ).slider( "value" ) );
});
$( function() {
	$( "#proc-offset" ).slider({
		min: 0,
		max: 30,
		value: 5,
		slide: function( event, ui ) {
			$( "#display-proc-offset" ).val( ui.value );
		}
	});
	$( "#display-proc-offset" ).val( $( "#proc-offset" ).slider( "value" ) );
});
$( function() {
	$( "#io-prob" ).slider({
		min: 0,
		max: 100,
		value: 50,
		slide: function( event, ui ) {
			$( "#display-io-prob" ).val( ui.value );
		}
	});
	$( "#display-io-prob" ).val( $( "#io-prob" ).slider( "value" ) );
});
$( function() {
	$( "#io-cycles" ).slider({
		min: 0,
		max: 30,
		value: 10,
		slide: function( event, ui ) {
			$( "#display-io-cycles" ).val( ui.value );
		}
	});
	$( "#display-io-cycles" ).val( $( "#io-cycles" ).slider( "value" ) );
});
$( function() {
	$( "#io-offset" ).slider({
		min: 0,
		max: 30,
		value: 0,
		slide: function( event, ui ) {
			$( "#display-io-offset" ).val( ui.value );
		}
	});
	$( "#display-io-offset" ).val( $( "#io-offset" ).slider( "value" ) );
});
$( function() {
	$( "#time-per-tick" ).slider({
		min: 0,
		max: 3000,
		value: 1000,
		slide: function( event, ui ) {
			$( "#display-time" ).val( ui.value );
		}
	});
	$( "#display-time" ).val( $( "#time-per-tick" ).slider( "value" ) );
});
$( function() {
	$( "#max-processes" ).slider({
		min: 1,
		max: 1000,
		value: 100,
		slide: function( event, ui ) {
			$( "#display-max-processes" ).val( ui.value );
		}
	});
	$( "#display-max-processes" ).val( $( "#max-processes" ).slider( "value" ) );
});
$( function() {
	$( "#list-limit" ).slider({
		min: 1,
		max: 250,
		value: 20,
		slide: function( event, ui ) {
			$( "#display-list-limit" ).val( ui.value );
		}
	});
	$( "#display-list-limit" ).val( $( "#list-limit" ).slider( "value" ) );
});

$(document).ready(function(){

	running = false;
	stopped = true;

	$('.start').click(function(){
		if (running) {
			console.log('~pausing~');
			$('.start').css('background-image','url(images/play_button.png)');
			$('.start').css('background-size','100%');
			running = false;
		} else {

			if (stopped) {
				console.log('~running~');
				$('.start').css('background-image','url(images/pause_button.png)');
				$('.start').css('background-size','108%');
				initialize();
				stopped = false;
				boot();
			}
			else {
				console.log('~running~');
				$('.start').css('background-image','url(images/pause_button.png)');
				$('.start').css('background-size','108%');
				set_variables();
				running = true;
				run();
			}
		}
	});
	
	$('#stop').click(function(){
		if(stopped)
			return;

		console.log('~stopping~');
		$('.start').css('background-image','url(images/play_button.png)');
		$('.start').css('background-size','100%');
		stop();
	});

	$('.toggle-overlay').click(function(){
		if ($('#overlay').css('display') != 'block')
			$('#overlay').css('display','block');
		else
			$('#overlay').css('display','none');
	});

	//ASSOSASITIVE ARRAY
	var sections = {
		'settings-tab': 'settings', 
		'lists-tab': 'lists',
		'status-tab': 'proc-status'
	};
	$('.tab').click(function() {
		if (! $(this).hasClass('active')) {
			$('.tab').removeClass('active');
			$(this).addClass('active');

			for (name in sections) {
				if ($('#' + name).hasClass('active'))
					$('#' + sections[name]).addClass('active');
				else
					$('#' + sections[name]).removeClass('active');
			}
		}
	});

	class Process {
		constructor(name) {
			this.name = name;
			this.state = "new";
			this.birth = cycle_count;
			this.waiting_time = 0;
			this.eficiency = 0;
			this.last_movement = cycle_count;
			this.cpu_time_required = proc_cycles + Math.floor(Math.random() * (2 * proc_offset + 1) - proc_offset);
			this.cpu_time_used = 0;

			if (io_prob > Math.random())
				this.io_time_required = io_cycles + Math.floor(Math.random() * (2 * io_offset + 1) - io_offset);
			else
				this.io_time_required = 0;
			this.io_time_used = 0;

			if (this.io_time_required > 0)
				this.requires_io_at = Math.floor(Math.random() * (this.cpu_time_required - 2) + 1);
			else
				this.requires_io_at = -1;
		}
	}

	class List {
		constructor(destination, state) {
			this.destination = destination;
			this.limit = list_limit;
			this.state = state;
			this.processes = [];
		}
		push(process) {
			this.processes.push(process);
		}
		pop() {
			if (this.processes[0] == null)
				return null;
			let process = this.processes[0];
			this.processes.splice(0, 1);
			return process;
		}
		update_text() {
			let destination = this.destination;
			destination.empty();
			if (this != finished_list)
				this.processes.forEach(function(process) {
					if (process != null)
						destination.append('<div>' + process.name + '</div>');
				});
			else
				this.processes.forEach(function(process) {
					if (process != null)
						destination.append('<div style="text-align:left;">' + process.name + ' Eficiencia: ' + process.eficiency + '</div>');
				});
			if (this == running_list && this.is_empty())
				destination.append('<div id="scheduler"> SCHEDULER (' + 
					(scheduling_time - scheduler_counter) + 
					') </div>' );
		}
		is_empty() {
			return (this.processes.length == 0);
		}
	}

	function update_display() {
		new_list.update_text();
		ready_list.update_text();
		running_list.update_text();
		waiting_io_list.update_text();
		using_io_list.update_text();
		finished_list.update_text();

		$('#clock').text(cycle_count);

		update_status();
	}

	function clear_text() {
		new_list.destination.empty();
		ready_list.destination.empty();
		running_list.destination.empty();
		waiting_io_list.destination.empty();
		using_io_list.destination.empty();
		finished_list.destination.empty();
		$('#proc-status .row').empty();
		$('#clock').empty();
	}

	function update_status() {
		$('#proc-status').html(
			'<div class="row">' +
			'<div class="col-xs-2">Name</div>'+
			'<div class="col-xs-2">State</div>'+
			'<div class="col-xs-2">CPU required</div>'+
			'<div class="col-xs-2">CPU used</div>'+
			'<div class="col-xs-2">I/O at cycle</div>' +
			'<div class="col-xs-2">I/O left</div>' +
			'</div>' );
		
		all_list.processes.forEach(function(process) {
			$('#proc-status').append(
				'<div class="row">' +
				'<div class="col-xs-2">' + process.name + '</div>' +
				'<div class="col-xs-2">' + process.state + '</div>' +
				'<div class="col-xs-2">' + process.cpu_time_required + '</div>' +
				'<div class="col-xs-2">' + process.cpu_time_used + '</div>' +
				'<div class="col-xs-2">' + ((process.requires_io_at > -1) ? process.requires_io_at : 'N/A') + '</div>' +
				'<div class="col-xs-2">' + (process.io_time_required - process.io_time_used) + '</div>' +
				'</div>' );
		});
	}

	function initialize() {
		running = false;
		cycle_count = 0;
		process_count = 0;
		active_processes = 0;
		moved = false;
		quantum_counter = 0;
		scheduler_counter = 0;

		set_variables();
		
		//initialize Lists
		all_list = new List();
		new_list = new List($('#new .processes'),'new');
		ready_list = new List($('#ready .processes'),'ready');
		running_list = new List($('#running .processes'),'running');
		waiting_io_list = new List($('#waiting-io .processes'),'waiting-io');
		using_io_list = new List($('#using-io .processes'),'using-io');
		finished_list = new List($('#finished .processes'),'finished');

		clear_text();
		$('#clock').text(cycle_count);
		update_status();
	}

	function set_variables() {
		list_limit = $('#list-limit').slider('value');
		max_active_processes = $('#max-processes').slider('value');
		boot_time = $('#boot-time').slider('value');
		scheduling_time = $('#scheduling-time').slider('value') - 1;

		quantum = $('#quantum-cycles').slider('value');
		tick_time = $('#time-per-tick').slider('value');

		prob = $('#new-process-prob').slider('value') / 100;
		proc_cycles = $('#proc-cycles').slider('value');
		proc_offset = $('#proc-offset').slider('value');
		
		io_prob = $('#io-prob').slider('value') / 100;
		io_cycles = $('#io-cycles').slider('value');
		io_offset = $('#io-offset').slider('value');
	}

	function stop() {
		running = false;
		stopped = true;
		clear_text();
	}

	function boot() {
		let interval = setInterval( function() {
			if (cycle_count == boot_time) { 
				stopped = false;
				running = true;
				run();
				clearInterval(interval);
			}
			cycle_count++;
			$('#clock').text(cycle_count);
		}, tick_time);
	}

	function run() {
		if (!running)
			return;

		moved = false;
		
		setTimeout(function() { 
			next_cycle(); 
			cycle_count++;
		}, tick_time);
	}

	function move_process(from, to) {
		if (from.processes[0].last_movement == cycle_count)
			return;

		process = from.pop();
		to.push(process);
		process.state = to.state;
		process.last_movement = cycle_count;
	}

	function try_creation() {
		if (!(active_processes < max_active_processes))
			return;

		if (new_list.processes.length < list_limit) {
			let gen = Math.random();
			if (gen <= prob) {
				let process = new Process('MAKARA_' + process_count);
				new_list.push(process);
				all_list.push(process);
				process_count++;
				active_processes++;
			}
		}
	}

	function move_new_ready_running() {
		if (running_list.is_empty()) {
			if (!new_list.is_empty()) {
			moved = true;
			new_list.processes.forEach(function() {
				if (ready_list.processes.length != list_limit)
					move_process(new_list,ready_list);
			});
			}
			if (!ready_list.is_empty()) {
				moved = true;
				move_process(ready_list,running_list);
			}
		}
	}

	function check_running() {
		let process = running_list.processes[0];
		if (process.cpu_time_used == process.cpu_time_required) {
			process.eficiency = (process.waiting_time / (cycle_count - process.birth)).toFixed(4);
			move_process(running_list,finished_list);
			scheduler_counter = 0;
			quantum_counter = 0;
			active_processes--;
		}
		else if (quantum_counter == quantum) {
			move_process(running_list,ready_list);
			scheduler_counter = 0;
			quantum_counter = 0;
			moved = true;
		}
		else if (running_list.processes[0].requires_io_at == running_list.processes[0].cpu_time_used & running_list.processes[0].io_time_used - running_list.processes[0].io_time_required != 0) {
			if (waiting_io_list.processes.length < list_limit)
				move_process(running_list,waiting_io_list);
			else
				move_process(running_list,ready_list)
			scheduler_counter = 0;
			quantum_counter = 0;
			moved = true;
		}
		else {
			running_list.processes[0].cpu_time_used++;
			quantum_counter++;
		}
	}

	function check_io() {
		if (using_io_list.is_empty() & !waiting_io_list.is_empty()) {
			process = waiting_io_list.pop();
			process.state = 'using-io';
			using_io_list.push(process);
		}
		else if (!using_io_list.is_empty()) {
			if (using_io_list.processes[0].io_time_used == using_io_list.processes[0].io_time_required) {
				process = using_io_list.pop();
				process.state = 'ready';
				ready_list.push(process);
				if (!waiting_io_list.is_empty()) {
					process = waiting_io_list.pop();
					processstate = 'using-io';
					using_io_list.push(process);
				}
			}
			else
				using_io_list.processes[0].io_time_used++;
		}
	}

	function scheduler() {
		if (running_list.is_empty()) {	
			move_new_ready_running();
		}
		check_io();
	}

	function age() {
		ready_list.processes.forEach(function(process){
			process.waiting_time++;
		});
		waiting_io_list.processes.forEach(function(process){
			process.waiting_time++;
		});
	}

	function next_cycle() {
		if (!running)
			return;
		//try to create new process
		try_creation();
		age();

		if (active_processes > 0) {
			//try to run the scheduler
			if (scheduler_counter < scheduling_time) {
				scheduler_counter++;
				if (running_list.processes[0] != null)
					check_running();
			}
			else {
				console.log('scheduler at cycle ' + cycle_count);
				
				if (running_list.processes[0] != null)
					check_running();
				scheduler();
				scheduler_counter = 0;
			}
		}

		//display all changes
		update_display();
		//try going for another cycle
		run();
	}
});