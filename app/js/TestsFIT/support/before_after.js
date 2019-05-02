'use script'


beforeTests(() => {
  return new Promise(ok => {
    FITAnalyse.setCurrent('tests/simple', {remove_events: true}, ok)
  })
})
afterTests(()=>{
  // console.log("Après les tests, je jouerai ça")
})
