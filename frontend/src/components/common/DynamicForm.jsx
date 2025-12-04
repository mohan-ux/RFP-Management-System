import React from 'react'

// A minimal dynamic form that renders inputs based on a JS object
// - strings/numbers -> input
// - boolean -> checkbox
// - arrays of primitives -> list with add/remove
// - arrays of objects -> render each object recursively
// - objects -> nested fieldset

const Input = ({ label, value, onChange, type = 'text' }) => (
  <div className="flex flex-col min-w-0 w-full">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
    <input
      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      type={type}
    />
  </div>
)

const TextArea = ({ label, value, onChange }) => (
  <div className="flex flex-col min-w-0 w-full">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
    <textarea 
      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all resize-none outline-none" 
      value={value ?? ''} 
      onChange={e => onChange(e.target.value)}
      rows={3}
    />
  </div>
)

const DynamicForm = ({ data = {}, onChange }) => {
  // Fields to skip rendering
  const skipFields = ['_id', 'createdAt', 'updatedAt', '__v', 'numberOfPeople', 'peopleCount', 'participants', 'attendees']
  
  // update helper
  const updateAt = (key, value) => {
    onChange({ ...data, [key]: value })
  }

  const renderValue = (key, value) => {
    // Skip certain fields
    if (skipFields.includes(key)) return null
    
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    if (value === null || value === undefined) {
      return (
        <Input key={key} label={label} value={''} onChange={(v) => updateAt(key, v)} />
      )
    }

    if (typeof value === 'string') {
      if (value.length > 120) {
        return <TextArea key={key} label={label} value={value} onChange={(v) => updateAt(key, v)} />
      }
      return <Input key={key} label={label} value={value} onChange={(v) => updateAt(key, v)} />
    }

    if (typeof value === 'number') {
      return <Input key={key} label={label} value={value} onChange={(v) => updateAt(key, Number(v))} type="number" />
    }

    if (typeof value === 'boolean') {
      return (
        <div key={key} className="flex items-center gap-2">
          <input type="checkbox" checked={value} onChange={e => updateAt(key, e.target.checked)} />
          <label className="text-sm">{label}</label>
        </div>
      )
    }

    if (Array.isArray(value)) {
      // arrays of primitives
      if (value.every(v => typeof v !== 'object')) {
        return (
          <div key={key} className="space-y-2 col-span-full min-w-0">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
            <div className="space-y-2">
              {value.map((v, i) => (
                <div key={i} className="flex items-center gap-2 min-w-0">
                  <input 
                    className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none" 
                    value={v} 
                    onChange={e => {
                      const next = [...value]; next[i] = e.target.value; updateAt(key, next)
                    }} 
                  />
                  <button 
                    type="button" 
                    className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0" 
                    onClick={() => { const next = value.filter((_, idx) => idx !== i); updateAt(key, next) }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button 
              type="button" 
              className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors" 
              onClick={() => updateAt(key, [...value, ''])}
            >
              + Add Item
            </button>
          </div>
        )
      }

      // arrays of objects (Items, Evaluation Criteria, etc.)
      return (
        <div key={key} className="space-y-3 col-span-full min-w-0">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">{label}</label>
          <div className="space-y-3">
            {value.map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                  <span className="text-sm font-bold text-gray-700">{label.replace(/s$/, '')} {i + 1}</span>
                  <button 
                    type="button" 
                    className="px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    onClick={() => { const next = value.filter((_, idx) => idx !== i); updateAt(key, next) }}
                  >
                    Remove
                  </button>
                </div>
                <DynamicForm data={item} onChange={(next) => { const nextArr = [...value]; nextArr[i] = next; updateAt(key, nextArr) }} />
              </div>
            ))}
          </div>
          <button 
            type="button" 
            className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors" 
            onClick={() => updateAt(key, [...value, {}])}
          >
            + Add {label.replace(/s$/, '')}
          </button>
        </div>
      )
    }

    if (typeof value === 'object') {
      return (
        <div key={key} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 col-span-full overflow-hidden">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">{label}</label>
          <DynamicForm data={value} onChange={(next) => updateAt(key, next)} />
        </div>
      )
    }

    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 min-w-0">
      {Object.keys(data).map(key => {
        const rendered = renderValue(key, data[key])
        return rendered ? <div key={key} className="min-w-0">{rendered}</div> : null
      })}
    </div>
  )
}

export default DynamicForm
