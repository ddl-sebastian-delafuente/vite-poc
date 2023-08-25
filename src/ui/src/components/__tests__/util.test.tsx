import {
  getFileType,
  isCSVFile,
  isPdfFile,
  isSvgFile,
  isZipFile
} from '../util';

describe('Experiments Util', () => {

  describe('getFileType', () => {
    it('should return "log" when *.log is input', () => {
      expect(getFileType('a.log')).toEqual('log');
    });

    it('should return "ipynb" when *.ipynb is input', () => {
      expect(getFileType('a.ipynb')).toEqual('ipynb');
    });

    it('should return "md" when *.md is input', () => {
      expect(getFileType('a.md')).toEqual('md');
    });

    it('should return "sh" when *.sh is input', () => {
      expect(getFileType('a.sh')).toEqual('sh');
    });

    it('should return "R" when *.R is input', () => {
      expect(getFileType('a.R')).toEqual('R');
    });

    it('should return "py" when *.py is input', () => {
      expect(getFileType('a.py')).toEqual('py');
    });

    it('should return "txt" when *.txt is input', () => {
      expect(getFileType('a.txt')).toEqual('txt');
    });

    it('should return "7z" when *.7z is input', () => {
      expect(getFileType('a.7z')).toEqual('7z');
    });

    it('should return "aif" when *.aif is input', () => {
      expect(getFileType('a.aif')).toEqual('aif');
    });

    it('should return "aifc" when *.aifc is input', () => {
      expect(getFileType('a.aifc')).toEqual('aifc');
    });

    it('should return "aiff" when *.aiff is input', () => {
      expect(getFileType('a.aiff')).toEqual('aiff');
    });

    it('should return "avi" when *.avi is input', () => {
      expect(getFileType('a.avi')).toEqual('avi');
    });

    it('should return "bin" when *.bin is input', () => {
      expect(getFileType('a.bin')).toEqual('bin');
    });

    it('should return "bmp" when *.bmp is input', () => {
      expect(getFileType('a.bmp')).toEqual('bmp');
    });

    it('should return "geojson" when *.geojson is input', () => {
      expect(getFileType('a.geojson')).toEqual('geojson');
    });

    it('should return "gif" when *.gif is input', () => {
      expect(getFileType('a.gif')).toEqual('gif');
    });

    it('should return "gz" when *.gz is input', () => {
      expect(getFileType('a.gz')).toEqual('gz');
    });

    it('should return "html" when *.html is input', () => {
      expect(getFileType('a.html')).toEqual('html');
    });

    it('should return "jpeg" when *.jpeg is input', () => {
      expect(getFileType('a.jpeg')).toEqual('jpeg');
    });

    it('should return "jpg" when *.jpg is input', () => {
      expect(getFileType('a.jpg')).toEqual('jpg');
    });

    it('should return "json" when *.json is input', () => {
      expect(getFileType('a.json')).toEqual('json');
    });

    it('should return "m4a" when *.m4a is input', () => {
      expect(getFileType('a.m4a')).toEqual('m4a');
    });

    it('should return "mid" when *.mid is input', () => {
      expect(getFileType('a.mid')).toEqual('mid');
    });

    it('should return "midi" when *.midi is input', () => {
      expect(getFileType('a.midi')).toEqual('midi');
    });

    it('should return "mov" when *.mov is input', () => {
      expect(getFileType('a.mov')).toEqual('mov');
    });

    it('should return "mp3" when *.mp3 is input', () => {
      expect(getFileType('a.mp3')).toEqual('mp3');
    });

    it('should return "mp4" when *.mp4 is input', () => {
      expect(getFileType('a.mp4')).toEqual('mp4');
    });

    it('should return "mpeg" when *.mpeg is input', () => {
      expect(getFileType('a.mpeg')).toEqual('mpeg');
    });

    it('should return "ogg" when *.ogg is input', () => {
      expect(getFileType('a.ogg')).toEqual('ogg');
    });

    it('should return "pdf" when *.pdf is input', () => {
      expect(getFileType('a.pdf')).toEqual('pdf');
    });

    it('should return "pkl" when *.pkl is input', () => {
      expect(getFileType('a.pkl')).toEqual('pkl');
    });

    it('should return "png" when *.png is input', () => {
      expect(getFileType('a.png')).toEqual('png');
    });

    it('should return "rar" when *.rar is input', () => {
      expect(getFileType('a.rar')).toEqual('rar');
    });

    it('should return "svg" when *.svg is input', () => {
      expect(getFileType('a.svg')).toEqual('svg');
    });

    it('should return "tar.gz" when *.tar.gz is input', () => {
      expect(getFileType('a.tar.gz')).toEqual('tar.gz');
    });

    it('should return "tif" when *.tif is input', () => {
      expect(getFileType('a.tif')).toEqual('tif');
    });

    it('should return "tiff" when *.tiff is input', () => {
      expect(getFileType('a.tiff')).toEqual('tiff');
    });

    it('should return "yaml" when *.MLproject is input', () => {
      expect(getFileType('a.MLproject')).toEqual('yaml');
    });

    it('should return "yaml" when *.MLmodel is input', () => {
      expect(getFileType('a.MLmodel')).toEqual('yaml');
    });

    it('should return "log" when *.err is input', () => {
      expect(getFileType('a.err')).toEqual('log');
    });

    it('should return "properties" when *.prop is input', () => {
      expect(getFileType('a.prop')).toEqual('properties');
    });

    it('should return "py" when *.py3 is input', () => {
      expect(getFileType('a.py3')).toEqual('py');
    });

    it('should return "rest" when *.rst is input', () => {
      expect(getFileType('a.rst')).toEqual('rest');
    });

    it('should return "json" when *.hocon is input', () => {
      expect(getFileType('a.hocon')).toEqual('json');
    });

    it('should return "json" when *.jsonnet is input', () => {
      expect(getFileType('a.jsonnet')).toEqual('json');
    });
  });

  describe('isCSVFile', () => {
    it('should return true when input is a csv file', () => {
      expect(isCSVFile('a.csv')).toEqual(true);
    });

    it('should return true when input is a tsv file', () => {
      expect(isCSVFile('a.tsv')).toEqual(true);
    });
  });

  describe('isPdfFile', () => {
    it('should return true when input is a pdf file', () => {
      expect(isPdfFile('a.pdf')).toEqual(true);
    });
  });

  describe('isSvgFile', () => {
    it('should return true when input is a svg file', () => {
      expect(isSvgFile('a.svg')).toEqual(true);
    });
  });

  describe('isZipFile', () => {
    it('should return true when input is a 7z file', () => {
      expect(isZipFile('a.7z')).toEqual(true);
    });

    it('should return true when input is a gzip file', () => {
      expect(isZipFile('a.gzip')).toEqual(true);
    });

    it('should return true when input is a zip file', () => {
      expect(isZipFile('a.zip')).toEqual(true);
    });

    it('should return true when input is a tar.gz file', () => {
      expect(isZipFile('a.tar.gz')).toEqual(true);
    });

    it('should return true when input is a tar.z file', () => {
      expect(isZipFile('a.tar.z')).toEqual(true);
    });

    it('should return true when input is a tar file', () => {
      expect(isZipFile('a.tar')).toEqual(true);
    });

    it('should return true when input is a gz file', () => {
      expect(isZipFile('a.gz')).toEqual(true);
    });

    it('should return true when input is a tgz file', () => {
      expect(isZipFile('a.tgz')).toEqual(true);
    });

    it('should return true when input is a taz file', () => {
      expect(isZipFile('a.taz')).toEqual(true);
    });

    it('should return true when input is a tar.xz file', () => {
      expect(isZipFile('a.tar.xz')).toEqual(true);
    });

    it('should return true when input is a tg file', () => {
      expect(isZipFile('a.tg')).toEqual(true);
    });

    it('should return true when input is a rar file', () => {
      expect(isZipFile('a.rar')).toEqual(true);
    });

    it('should return true when input is a bz2 file', () => {
      expect(isZipFile('a.bz2')).toEqual(true);
    });

    it('should return true when input is a b6z file', () => {
      expect(isZipFile('a.b6z')).toEqual(true);
    });

    it('should return true when input is a sitx file', () => {
      expect(isZipFile('a.sitx')).toEqual(true);
    });

    it('should return true when input is a sit file', () => {
      expect(isZipFile('a.sit')).toEqual(true);
    });

    it('should return true when input is a zst file', () => {
      expect(isZipFile('a.zst')).toEqual(true);
    });

    it('should return true when input is a tzst file', () => {
      expect(isZipFile('a.tzst')).toEqual(true);
    });

    it('should return true when input is a tbz file', () => {
      expect(isZipFile('a.tbz')).toEqual(true);
    });

    it('should return true when input is a tbz2 file', () => {
      expect(isZipFile('a.tbz2')).toEqual(true);
    });

    it('should return true when input is a bz2 file', () => {
      expect(isZipFile('a.bz2')).toEqual(true);
    });
  });
});
