"use strict"

window.ut = window.ut || {}
window.ut.commons = window.ut.commons || {}

class window.ut.commons.TogetherClient

  ###*
   * Constructor of the TogetherClient. Handles the configuration, loading and initialization of TogetherJS.
   * @param {model} the data model to be synchronized. in particular the functions "getResourceContent", "loadContentFromExternalState", and "applyLogAction" are required
   * @param {metadataHandler} the MetadataHandler which is attached to the model
   * @param {actionLogger} the ActionLogger which is attached to the model
   * @param {masterModel} the master data model, this must be an instance of the data model, which CAN be used as master model
   #                      the application should not use this model
  ###
  constructor: (@model, @metadataHandler, @actionLogger, @masterModel) ->
    @debug = true
    @showStatistics = false

    console.log("Initializing TogetherClient.") if @debug

    @verbsWhitelist = ["add", "remove", "change", "open", "clear"]

    # removing a potentially old session key
    window.sessionStorage.removeItem("togetherjs-session.status")

    # configure Together.js before loading it
    window.TogetherJSConfig_hubBase = "https://hub.togetherjs.com"
    window.TogetherJSConfig_dontShowClicks = false
    window.TogetherJSConfig_autoStart = true
    window.TogetherJSConfig_disableWebRTC = true
    window.TogetherJSConfig_disableChat = false
    window.TogetherJSConfig_disableShareButton = true
    window.TogetherJSConfig_getUserName = @getUserName
    window.TogetherJSConfig_on_ready = @initTogether
    window.TogetherJSConfig_toolName = @metadataHandler.getMetadata().generator.displayName
    window.TogetherJSConfig_suppressJoinConfirmation = true
    window.TogetherJSConfig_suppressInvite = true
    window.TogetherJSConfig_ignoreForms = true
    window.TogetherJSConfig_findRoom = @createSessionID()
    window.TogetherJSTestSpy = {}
    golab.common.resourceLoader.ready(() ->)
    golab.common.resourceLoader.orderedLoad([["https://code.highcharts.com/highcharts.js", "https://code.highcharts.com/modules/exporting.js", "/libs/js/togetherjs/togetherjs-min.js"], ["/libs/js/togetherjs/togetherjs.css", "/libs/js/togetherjs/togetherjs_custom.css","/libs/js/togetherjs/togetherjsPackage.js"]])

  createSessionID: () =>
    underScoreIndex = @getUserName().indexOf("_")
    sessionID = @metadataHandler.getMetadata().generator.id
    if underScoreIndex isnt -1
      console.warn "found an underscore _ in the username, adding the suffix to the room (used to create collaboration groups)"
      sessionID += @getUserName().substring(underScoreIndex, @getUserName().length)
    else if @metadataHandler.getMetadata().actor.objectType is "group"
      console.warn "found group information in metadata, adding the group ID to the room ID."
      sessionID += @metadataHandler.getMetadata().actor.id
    console.log "using sessionID: #{sessionID}"
    return sessionID

  initTogether: () =>
    console.log "TogetherJS init." if @debug
    @masterId = undefined
    @selfId = TogetherJS.require('peers').Self.id
    console.log "clientId set to #{@selfId}" if @debug
    @chatRecord = []
    @chatStatistics = {}
    @actionStatistics = {}
    if TogetherJS.require('peers').getAllPeers().length is 0
      console.log "I'm the first in this session -> I am master." if @debug
      @masterId = @selfId
    else
      console.log "somebody else is master, I'll know as soon as the initial state is sent." if @debug
    # when leaving the page, close the session for this client
    @lpg = new ut.commons.LeavePageDetector()
    @lpg.addHandler @leaveSession
    # hooking up listener to the actionLogger
    @actionLogger.addLogListener @
    # hooking up listeners to the Together.js hub
    TogetherJS.hub.on "togetherjs.hello", @welcomeLatecomer
    TogetherJS.hub.on "togetherjs.bye", @peerDisconnected
    TogetherJS.hub.on "togetherjs.chat", @chatReceived
    TogetherJS.hub.on "initialState", @setInitialState
    TogetherJS.hub.on "chatRecord", @setChatRecord
    TogetherJS.hub.on "actionStatistics", @setActionStatistics
    TogetherJS.hub.on "currentState", @setCurrentState
    TogetherJS.hub.on "actionLog", @applyActionLogMessage
    TogetherJS.hub.on "electMaster", @electMaster
    TogetherJS.require('session').on "send", @logChat
    @fixDock()
    if @showStatistics
      @initStatisticsDock()
      @updateChatChart()
      @updateActionChart()

  initStatisticsDock: () =>
    $("#togetherjs-container").append "
      <div id='togetherjs-statistics-dock'>
        <table id='statistics-table'>
          <tr>
          <td width='50%'><div id='togetherjs-statistics-chat'></div></td>
          <td width='50%'><div id='togetherjs-statistics-actions'></div></td>
          </tr>
        </table>
      </div>"
    $("#togetherjs-statistics-dock").draggable({containment: "body"})
    @chatChart = new Highcharts.Chart {
      credits: {
        enabled: false
      }
      chart: {
        renderTo: "togetherjs-statistics-chat"
        type: 'column'
      }
      title: {
        text: 'Chat statistics'
      }
      xAxis: {
        categories: ['dummy']
      }
      series: [{
        name: 'messages sent'
        data: [42]
      }]
    }
    @actionChart = new Highcharts.Chart {
      credits: {
        enabled: false
      }
      chart: {
        renderTo: "togetherjs-statistics-actions"
        type: 'column'
      }
      title: {
        text: 'Action statistics'
      }
      xAxis: {
        categories: ['A', 'B', 'C', 'D']
      }
      series: [{
        name: 'actions performed'
        data: [3]
        color: 'green'
      }]
    }

  updateChatChart: () =>
    if @showStatistics
      @chatChart.xAxis[0].categories = Object.keys @chatStatistics
      @chatChart.series[0].setData Object.keys(@chatStatistics).map (key) => @chatStatistics[key]

  updateActionChart: () =>
    if @showStatistics
      @actionChart.xAxis[0].categories = Object.keys @actionStatistics
      @actionChart.series[0].setData Object.keys(@actionStatistics).map (key) => @actionStatistics[key]

  fixDock: () =>
    $("#togetherjs-dock").draggable({containment: "body"})
    $("#togetherjs-chat").draggable({containment: "body"})
    $("#togetherjs-rtc-info").draggable({containment: "body"})
    $("#togetherjs-share").draggable({containment: "body"})

  logChat: (message) =>
    if message.type is "chat"
      logObject = {
        objectType: "chat"
        text: message.text
        messageId: message.messageId
        clientId: message.clientId
      }
      @actionLogger.logSend(logObject)

  ###*
   * Function used to determine who is the master in the current session. Should be called when you or somebody else joins or leaves the session.
   * This function sets the flag @iAmMaster accordingly.
  ###
  electMaster: () =>
    newMasterId = @selfId
    for peer in TogetherJS.require('peers').getAllPeers()
      console.log "checking peer:"
      console.log peer
      if (peer.status isnt "bye") and (peer.idle isnt "inactive") and (peer.id isnt @masterId) and (peer.id > newMasterId)
        # the client with the "largest" id becomes master
        newMasterId = peer.id
    if newMasterId is @masterId
      console.log "the new master is the same as the old master, no further actions necessary." if @debug
    else
      @masterId = newMasterId
      console.log "new master selected: #{@masterId}"
      if @iAmMaster()
        console.log "it's me! send out the current state." if @debug
        @sendCurrentState()

  iAmMaster: () =>
    if @selfId is @masterId
      return true
    else
      return false

  ###*
   * Function used by TogetherJS to determine the local username
   * @return {String} the current local username
  ###
  getUserName: () =>
    return @metadataHandler.getActor().displayName

  ###*
   * Function to leave the current session. Used by the LeavePageDetector
  ###
  leaveSession: () =>
    console.log "leaving session" if @debug
    TogetherJS.require('session').close()

  peerDisconnected: (message) =>
    console.log "peer disconnected:" if @debug
    console.log message if @debug
    if message.clientId is @masterId
      console.log "the master disconnected - we have to elect a new one" if @debug
      TogetherJS.send {type: "electMaster"}
      @electMaster()
    else
      console.log "somebody disconnected, but it's not the master" if @debug

  ###*
   * Function to welcome a latecomer to the current session, i.e. to transmit the current state of the model
   * @param {JSON object} TogetherJS message, message.model contains the model to be applied
   * @return {boolean} true if the state has been applied to the local model; false otherwise
  ###
  welcomeLatecomer: (message) =>
    console.log "latecomer detected. shall I send the initial content?" if @debug
    console.log "...#{@iAmMaster()}"
    if @iAmMaster()
      TogetherJS.send {type: "initialState", forClient: message.clientId, model: @model.getResourceContent()}
      TogetherJS.send {type: "chatRecord", forClient: message.clientId, chatRecord: @chatRecord}
      TogetherJS.send {type: "actionStatistics", forClient: message.clientId, actionStatistics: @actionStatistics}
    if not @chatStatistics[message.peer.name]?
      @chatStatistics[message.peer.name] = 0
    if not @actionStatistics[message.peer.name]?
      @actionStatistics[message.peer.name] = 0
    @updateChatChart()

  ###*
   * Function to apply a full state to the local model
   * @param {JSON object} TogetherJS message, message.model contains the model to be applied
   * @return {boolean} true if the state has been applied to the local model; false otherwise
  ###
  setInitialState: (message) =>
    if message.forClient is @selfId
      # that message is for me, set the state
      @model.loadContentFromExternalState(message.model)
      # now I know who's the master:
      @masterId = message.clientId
      return true
    else
      console.log "ignoring 'initialState' message, it was meant for a different client" if @debug
      return false

  increaseChatStatistic: (name) =>
    if @chatStatistics[name]?
      @chatStatistics[name] = @chatStatistics[name]+1
    else @chatStatistics[name] = 1

  increaseActionStatistic: (name) =>
    if @actionStatistics[name]?
      @actionStatistics[name] = @actionStatistics[name]+1
    else @actionStatistics[name] = 1

  setActionStatistics: (message) =>
    if message.forClient is @selfId
      console.log message
      # that message is for me, set the state
      @actionStatistics = message.actionStatistics
      @updateActionChart()

  setChatRecord: (message) =>
    if message.forClient is @selfId
      # that message is for me, set the state
      @chatRecord = message.chatRecord
      # now I know who's the master:
      @masterId = message.clientId
      # setting my own name initially, so that I appear always first in the chat
      @chatStatistics[TogetherJS.require('peers').Self.name] = 0
      for chatMessage in @chatRecord
        if chatMessage.text?
          @increaseChatStatistic(chatMessage.name)
          date = new Date(chatMessage.date)
          hours = date.getHours()
          minutes = date.getMinutes()
          if hours > 12
            hours = hours-12
            am = "PM"
          else
            am = "AM"
          if chatMessage.name is TogetherJS.require('peers').Self.name
            person = "togetherjs-person-self"
            abbrev = "togetherjs-person-name-abbrev togetherjs-person-name-abbrev-self"
            name = "me"
          else
            clientIdWithoutDot = chatMessage.clientId.replace(".", "_")
            person = "togetherjs-person-#{clientIdWithoutDot} togetherjs-person-other-url"
            abbrev = "togetherjs-person-name-abbrev togetherjs-person-name-abbrev-#{clientIdWithoutDot}"
            name = chatMessage.name

          $("#togetherjs-chat-messages").append "
            <div class='togetherjs-chat-item togetherjs-chat-message' data-person='#{chatMessage.clientId}' data-date='#{message.data}' data-message-id='#{chatMessage.messageId}' id='togetherjs-chat-#{chatMessage.messageId}'>
              <div class='togetherjs-person #{person}' title='#{chatMessage.name}' style='border-color: rgb(143, 188, 143); background-image: url(&quot;https://togetherjs.com/togetherjs/images/default-avatar.png&quot;);'>
                <div class='togetherjs-person-avatar-swatch' style='border-top-color: rgb(143, 188, 143); border-right-color: rgb(143, 188, 143);'></div>
              </div>
              <div class='togetherjs-timestamp'>
                <span class='togetherjs-time'>#{hours}:#{minutes}</span>
                <span class='togetherjs-ampm'>#{am}</span>
              </div>
              <div class='#{abbrev}'>#{name}</div>
              <div class='togetherjs-chat-content'>#{chatMessage.text}</div>
            </div>"
      @updateChatChart()
      return true
    else
      console.log "ignoring 'chatRecord' message, it was meant for a different client" if @debug
      return false

  setCurrentState: (message) =>
    if @iAmMaster()
      # huh? somebody else is sending this although I'm the master?
      # better trigger an election
      console.log "master-conflict, trigger an election"
      TogetherJS.send {type: "electMaster"}
      @electMaster()
      return false
    else
      console.log "master state received, apply and reset log action timer."
      window.clearTimeout @logActionSentTimeout
      @model.loadContentFromExternalState(message.model)
      return true

  sendCurrentState: () =>
    TogetherJS.send {type: "currentState", model: @model.getResourceContent()}

  ###*
   * Function to process an action log coming from the local model.
   * If I'm master, send out the current state. If not, send only the action.
   * @param {JSON object} log action in activityStream format
  ###
  logAction: (logObject) =>
    console.log "LogAction received from local model: #{logObject.verb}" if @debug
    console.log logObject
    if not TogetherJS.running
      return
    if logObject.verb in @verbsWhitelist
      @increaseActionStatistic(TogetherJS.require('peers').Self.name)
      @updateActionChart()
      if @iAmMaster()
        console.log "local model changed, and I'm master -> send the current state."
        @sendCurrentState()
      else
        console.log "local model changed, and I'm client -> send the action and init timer."
        TogetherJS.send {type: "actionLog", logObject: logObject}
        @logActionSentTimeout = setTimeout () =>
          console.log "I've sent out an action log some time ago, but my timer wasn't reset." if @debug
          console.log "Is the master dead? Triggering an election." if @debug
          TogetherJS.send {type: "electMaster"}
          @electMaster()
        , 5000
    else if logObject.verb is "send"
      @chatSent(logObject)
    else
      console.log "ignoring non-whitelisted action log verb '#{logObject.verb}'"
      return false

  chatSent: (logObject) =>
    @chatRecord.push {
      text: logObject.object.text
      clientId: logObject.object.clientId
      date: Date.now()
      messageId: logObject.object.messageId
      name: TogetherJS.require('peers').Self.name
    }
    @increaseChatStatistic(TogetherJS.require('peers').Self.name)
    @updateChatChart()

  chatReceived: (message) =>
    console.log "chat Received:"
    console.log message
    @chatRecord.push {
      text: message.text
      clientId: message.peer.id
      date: Date.now()
      messageId: message.messageId
      name: message.peer.name
    }
    @increaseChatStatistic(message.peer.name)
    @updateChatChart()

  ###*
   * Function to pass a received action log to the local model
   * @param {JSON object} TogetherJS message, message.logObject would be the activityStream action log object
   * @return {boolean} true if action log has been passed to the local model; false otherwise
  ###
  applyActionLogMessage: (message) =>
    if message.clientId is @selfId
      # sent by myself -> ignore
      # should not happen, but just to be sure
      console.warn "ignoring message sent by myself, this shouldn't happen."
      return false
    else if message.logObject?
      @increaseActionStatistic(message.peer.name)
      @updateActionChart()
      if @iAmMaster()
      # the master applies the log action to the local model and sends out the new state
        @model.applyLogAction message.logObject, () =>
          console.log "remote action log has been applied to local master model, send out the current state." if @debug
          @sendCurrentState()
          return true
      else
        console.log "remote action log received, but I'm not master -> ignore." if @debug
    else
      console.warn "ignoring message without a logObject, this shouldn't happen"
      return false