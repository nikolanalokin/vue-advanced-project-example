

export default class AudioRecorder {

  constructor ({
    stream
  }) {
    // create the MediaStreamAudioSourceNode
    this.ctx = new AudioContext()
    this.source = this.ctx.createMediaStreamSource(stream)

    this.__stream = stream
  }
  
  start () {
    var recLength = 0
      , recBuffersL = []
      , recBuffersR = []

    // create a ScriptProcessorNode
    if(!this.ctx.createScriptProcessor){
      node = this.ctx.createJavaScriptNode(4096, 2, 2)
    } else {
      node = this.ctx.createScriptProcessor(4096, 2, 2)
    }

    // listen to the audio data, and record into the buffer
    node.onaudioprocess = e => {
      recBuffersL.push(e.inputBuffer.getChannelData(0))
      recBuffersR.push(e.inputBuffer.getChannelData(1))
      recLength += e.inputBuffer.getChannelData(0).length
    }

    // connect the ScriptProcessorNode with the input audio
    this.source.connect(node)
    // if the ScriptProcessorNode is not connected to an output the "onaudioprocess" event is not triggered in chrome
    node.connect(ctx.destination)
  }

  stop () {

  }
}