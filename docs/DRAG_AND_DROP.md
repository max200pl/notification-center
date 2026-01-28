# Drag and Drop Buttons - Feature Documentation

## Overview

The HTML Template Builder now supports **drag-and-drop positioning** for buttons in the Live Preview. This allows you to visually arrange button positions by simply dragging them with your mouse.

## Features

- 🎯 **Visual Positioning** - Click and drag buttons to any position
- 🔄 **Real-time Updates** - See changes instantly in the preview
- 💾 **Persistent Positions** - Button positions are saved in the configuration
- 🔁 **Reset Function** - Quickly reset all buttons to default positions
- 📏 **Template-wide Dragging** - Drag buttons anywhere within the entire notification template
- 🎛️ **Grid Snapping** - Snap buttons to a 20px grid for perfect alignment
- ⌨️ **Keyboard Toggle** - Press `G` to toggle grid snapping on/off
- 👁️ **Visual Grid** - See the alignment grid in the preview when buttons are draggable

## How to Use

### 1. Enable Draggable for Individual Buttons

In the **Advanced Builder** page:

1. Open the **🔘 Buttons Library** section in the left panel
2. For each button you want to make draggable:
   - Check the **🎯 Draggable** checkbox next to the button
   - The button card will get a blue border
   - Position coordinates (X, Y) will appear below the label
3. An info banner will appear in the preview showing draggable button count

### 2. Drag Buttons

1. Click and hold any draggable button in the Live Preview
2. Drag it to your desired position anywhere in the template
3. Release to drop the button
4. The position is automatically saved and displayed in the library

**Grid Snapping:**

- By default, buttons snap to a 20px grid for precise alignment
- Press the `G` key to toggle grid snapping on/off
- Visual grid lines appear in the preview to help with positioning
- Grid snapping makes it easy to align buttons horizontally and vertically

### 3. View Real-time Positions

In the **Buttons Library**:
- Each draggable button shows its current position
- X and Y coordinates update in real-time as you drag
- Positions are displayed in monospace font for precision

### 4. Reset Positions

If you want to reset all draggable button positions:

1. Click the **🔄 Reset All Positions** button (appears when any button is draggable)
2. All draggable buttons will return to their default grid positions

### 5. Disable Draggable

To make a button static again:

1. Uncheck the **🎯 Draggable** checkbox for that button
2. The button will return to the standard grid layout
3. Its position data is preserved for if you re-enable draggable

## Technical Details

### Button Configuration

```typescript
interface ButtonConfig {
  id: string;
  label: string;
  action?: string;
  position?: { x: number; y: number };
  draggable?: boolean;
}
```

### Default Positions

When Drag Mode is enabled, buttons start at:
- Button 1: `(10, 10)`
- Button 2: `(200, 10)`
- Button 3: `(10, 70)`
- Button 4: `(200, 70)`

### API Methods

```typescript
// Enable drag mode for all buttons
builder.enableDraggableButtons(true);

// Update button positions
builder.updateButtonPositions({
  'button-id': { x: 100, y: 50 },
  'another-button': { x: 250, y: 50 },
});
```

## Visual States

### Normal Button
```css
button {
  cursor: pointer;
  transition: box-shadow 0.2s;
}
```

### Draggable Button
```css
button.draggable {
  cursor: move;
}

button.draggable:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
```

### Dragging State
```css
button.draggable.dragging {
  opacity: 0.5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

## Communication Flow

### 1. Parent → Template (Enable Drag Mode)

```typescript
// Parent sets draggable: true on buttons
const builder = new HtmlTemplateBuilder()
  .setButtons([
    { id: 'btn1', label: 'Button 1', draggable: true, position: { x: 10, y: 10 } }
  ]);
```

### 2. Template → Parent (Position Updates)

```javascript
// Template sends position updates via postMessage
window.parent.postMessage({
  type: 'buttonPositionsUpdate',
  positions: {
    'btn1': { x: 150, y: 75 },
    'btn2': { x: 250, y: 75 },
  }
}, '*');
```

### 3. Parent Receives Update

```typescript
// Parent listens for messages and updates state
window.addEventListener('message', (event) => {
  if (event.data?.type === 'buttonPositionsUpdate') {
    const positions = event.data.positions;
    // Update button configurations
  }
});
```

## Use Cases

### 1. Custom Layouts
Create unique button arrangements that don't follow the standard grid:
```
┌─────────────────┐
│     [Save]      │
│                 │
│ [Cancel] [Help] │
└─────────────────┘
```

### 2. Responsive Design Testing
Test how buttons look at different positions before finalizing the layout.

### 3. A/B Testing
Try different button placements to see which gets better engagement.

### 4. Accessibility
Position important buttons in more accessible locations.

## Constraints

- Buttons can be dragged anywhere within the notification card template
- Minimum position: `(0, 0)`
- Maximum position: Template width/height minus button size
- Buttons can overlap (no collision detection)
- Grid snapping uses 20px increments when enabled

## Browser Compatibility

Works in all modern browsers that support:
- ✅ `mousedown`, `mousemove`, `mouseup` events
- ✅ `postMessage` API
- ✅ CSS absolute positioning
- ✅ Data attributes (`dataset`)

## Example Code

### Full Example with Drag Mode

```typescript
import { HtmlTemplateBuilder } from './lib/htmlTemplateBuilder';

const builder = new HtmlTemplateBuilder()
  .setTitle('My Notification')
  .setButtons([
    { id: 'save', label: 'Save', action: 'save', position: { x: 20, y: 20 } },
    { id: 'cancel', label: 'Cancel', action: 'cancel', position: { x: 150, y: 20 } },
  ])
  .enableDraggableButtons(true); // Enable drag mode

const html = builder.build();
```

### Listening to Position Changes

```typescript
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'buttonPositionsUpdate') {
      console.log('New positions:', event.data.positions);
      // Update your state here
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

## Best Practices

1. **Always test positions** - Make sure buttons don't overlap important content
2. **Use consistent spacing** - Maintain visual balance between buttons
3. **Consider mobile** - Test how positions look on smaller screens
4. **Save configurations** - Export button positions for reuse
5. **Provide reset option** - Always allow users to reset to defaults

## Troubleshooting

### Buttons not draggable?
- ✅ Check that Drag Mode is enabled
- ✅ Verify `draggable: true` is set on buttons
- ✅ Make sure you're using Advanced Builder mode

### Positions not saving?
- ✅ Check browser console for errors
- ✅ Verify postMessage is working
- ✅ Check that parent is listening for messages

### Buttons outside container?
- ✅ Positions are constrained automatically
- ✅ Use Reset Positions to fix

## Future Enhancements

Potential future improvements:

- ✅ Grid snapping (implemented - 20px grid with G key toggle)
- Alignment guides
- Collision detection
- Undo/redo functionality
- Save/load presets
- Keyboard controls for positioning (arrow keys)
- Touch support for mobile
- Customizable grid size
- Multiple snap points

---

**Note**: This feature is currently available only in the **Advanced Builder** mode.
