"use strict"

window.ut = window.ut || {}
window.ut.commons = window.ut.commons || {}

class window.ut.commons.LeavePageDetector

  constructor: () ->
    @debug = true
    @handlers = []
    @leavePageHandled = false
    window.onbeforeunload = =>
      console.log("LeavePageDetector: window.onbeforeunload start") if @debug
      @leavingPage()
      console.log("LeavePageDetector: window.onbeforeunload end") if @debug
    window.onunload = =>
      console.log("LeavePageDetector: window.onunload start") if @debug
      @leavingPage()
      console.log("LeavePageDetector: window.onunload end") if @debug
    if (head.mobile)
      ###
      on desktops the onbeforeunload and onunload are working
      but on mobile devices devices (iPad/ios8 and nexus4/andriod5) the onbeforeunload and onunload are not send/catched? when
      - tab is closed
      - browser app is left
      In order to make the change to loose data smaller, catch the window.onblur
      The change detection will de a save after 2 seconds of no changes, but it waits no longer then 20 seconds.
      Handle the onblur sooner then 2 seconds, but give the job after the onblur some time to get ready.
      ###
      window.onblur = =>
        console.log "LeavePageDetector: window.onblur start" if @debug
        setTimeout(=>
          @leavingPage(false)
          console.log "LeavePageDetector: window.onblur end" if @debug
        , 500)
    console.log("LeavePageDetector: setup finished") if @debug

  addHandler: (handler) =>
    @handlers.push(handler)

  leavingPage: (realPageLeave = true) =>
    console.log("LeavePageDetector: leavingPage, leavePageHandled: #{leavePageHandled}") if @debug
    if (!leavePageHandled)
      console.log("calling #{@handlers.length} handlers") if @debug
      for handler in @handlers
        try
          handler()
        catch error
          debugger
          console.error(error)
          alert(error)
    leavePageHandled = realPageLeave
    return

  simulateLeave: () =>
    console.log("LeavePageDetector: simulating leave page....") if @debug
    # call leavingPage outside the angular event cycle
    setTimeout(=>
      @leavingPage(false)
    , 50)

