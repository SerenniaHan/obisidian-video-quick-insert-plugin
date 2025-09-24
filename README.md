# Quick Video Insert

A convenient Obsidian plugin that allows you to quickly insert videos into your notes from both local files and online URLs.

## Features

- **Dual Video Sources**: Insert videos from local files or online URLs
- **Local File Import**: Browse and import video files directly into your vault
- **URL Embedding**: Embed videos from online sources using iframe
- **Customizable Size**: Set custom width and height for your video players
- **Cross-Platform**: Works on both desktop and mobile devices
- **Multiple Video Formats**: Supports common video formats (MP4, WebM, OGV, etc.)

## Installation

### From Obsidian Community Plugins (Recommended)

1. Open Obsidian Settings
2. Navigate to **Community plugins**
3. Click **Browse** and search for "Quick Video Insert"
4. Install and enable the plugin

### Manual Installation

1. Download the latest release from the [GitHub releases page](https://github.com/SerenniaHan/obisidian-video-quick-insert-plugin/releases)
2. Extract the files to your vault's plugins folder: `<vault>/.obsidian/plugins/obsidian-video-quick-insert/`
3. Reload Obsidian and enable the plugin in **Settings → Community plugins**

## Usage

### Basic Usage

1. Place your cursor where you want to insert the video
2. Open the command palette (`Ctrl+P` / `Cmd+P`)
3. Search for and select **"Insert Video Link"**
4. Choose your video source and configure settings
5. Click **"Insert"** to add the video to your note

### Video Sources

#### Local Video Files

- Select **"Local File"** from the dropdown
- Choose the destination folder for importing your video
- Click **"Browse"** to select a video file from your computer
- The video will be copied to your vault and embedded using HTML5 `<video>` tags

#### Online Video URLs

- Select **"Video URL"** from the dropdown  
- Enter the video URL (supports YouTube, Vimeo, and other embeddable sources)
- The video will be embedded using an `<iframe>`

### Size Configuration

Set custom dimensions for your video player:

- **Width**: Set the width (e.g., `640`, `auto`, `100%`)
- **Height**: Set the height (e.g., `360`, `auto`, `50vh`)

### Keyboard Shortcuts

While the insert modal is open:

- **Enter**: Insert the video with current settings
- **Escape**: Cancel and close the modal

## Examples

### Local Video

```html
<video controls width="640" height="360">
    <source src="app://obsidian.md/Imported Videos/my-video.mp4" type="video/mp4">
</video>
```

### YouTube Video

```html
<iframe width="640" height="360" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen/>
```

## Supported Video Sources

### Local Files

- MP4 (.mp4)
- WebM (.webm)
- OGV (.ogv)
- AVI (.avi)
- MOV (.mov)
- And other formats supported by HTML5 video

### Online Sources

- YouTube (use embed URLs)
- Vimeo
- Direct video file URLs
- Any embeddable video source

## Tips and Best Practices

1. **Local Files**: For better vault portability, use local files when possible
2. **File Organization**: Create a dedicated folder (e.g., "Videos" or "Media") for imported videos
3. **Size Settings**: Use `auto` for responsive videos that adapt to your note width
4. **URL Format**: For YouTube videos, use embed URLs: `https://www.youtube.com/embed/VIDEO_ID`
5. **Performance**: Large video files may impact vault sync speed

## Troubleshooting

### Video Not Playing

- **Local files**: Ensure the video format is supported by your browser
- **Online videos**: Check that the URL is accessible and embeddable
- Try refreshing the note or restarting Obsidian

### Import Issues

- Ensure you have write permissions to the selected import folder
- Check that the video file isn't corrupted
- Verify the file format is supported

### Display Problems

- Adjust width/height settings if the video appears too large or small
- Use percentage values (e.g., `100%`) for responsive design
- Check if your theme CSS interferes with video display

## Development

### Building from Source

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests on the [GitHub repository](https://github.com/SerenniaHan/obisidian-video-quick-insert-plugin).

## License

This plugin is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/SerenniaHan/obisidian-video-quick-insert-plugin/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SerenniaHan/obisidian-video-quick-insert-plugin/discussions)
- **Funding**: [Support the Developer](https://github.com/SerenniaHan/obisidian-video-quick-insert-plugin)

## Changelog

### v1.0.0

- Initial release
- Support for local video file import
- Support for online video URL embedding
- Customizable video player dimensions
- Cross-platform compatibility

---

**Author**: [Yihoo Kan](https://github.com/SerenniaHan)  
**Version**: 1.0.0  
**Minimum Obsidian Version**: 0.15.0