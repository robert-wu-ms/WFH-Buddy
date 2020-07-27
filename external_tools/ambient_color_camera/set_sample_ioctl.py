from pathlib import Path
import subprocess


def __get_set_sample_ioctl_path():
    TOOL_NAME = 'SetSampleIoctl.exe'
    path = Path(__file__)
    return str(path.parent) + '\\deps\\' + TOOL_NAME


def set_acs_sample(chroma_x, chroma_y):
    # Format: SetSampleIoctl.exe 3 ALS [Lux] [Kelvins] [ChromaticityX] [ChromaticityY] [IsValid]
    output = subprocess.check_output([__get_set_sample_ioctl_path(), '3', 'ALS', '0', '0',
                                      str(chroma_x), str(chroma_y), '1'])
    print(output.decode('utf-8'))
