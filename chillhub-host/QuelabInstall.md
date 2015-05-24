# ChillHub Host Configuration

These are instructions for installing ChillHub components on a fresh Raspberry Pi 2 Model B.

## Install Arch Linux on SD Card

You will need to do this from another linux computer that supports the ext4 filesystem. Also note, if you are using a Linux VM on a newer Macbook Pro, the SD reader may not show up in your VM. The easiest workaround for this is to just use a USB sd card reader.

___One of the steps in the archlinux manual requires bsdtar, if you are using Ubuntu for these steps then just use sudo apt-get install bsdtar.___

Raspberry Pi v2:
http://archlinuxarm.org/platforms/armv7/broadcom/raspberry-pi-2

```
These instructions were taken from the archlinux wiki
```

### SD Card Creation
think 'Lets install the ChillHub firmware'
check 'first we need to install ArchLinux'
check 'lets find the SD card'

1. Figure out which disk to format by running dmesg after inserting the sd card.
```bash
> dmesg |tail
```
```
[1506257.583668] scsi4 : usb-storage 1-1:1.0
[1506258.585620] scsi 4:0:0:0: Direct-Access     SanDisk  SDDR-113         9412 PQ: 0 ANSI: 0
[1506258.586513] sd 4:0:0:0: Attached scsi generic sg2 type 0
[1506258.883008] sd 4:0:0:0: [sdb] 3911680 512-byte logical blocks: (2.00 GB/1.86 GiB)
[1506258.888599] sd 4:0:0:0: [sdb] Write Protect is off
[1506258.888604] sd 4:0:0:0: [sdb] Mode Sense: 03 00 00 00
[1506258.892992] sd 4:0:0:0: [sdb] No Caching mode page found
[1506258.897650] sd 4:0:0:0: [sdb] Assuming drive cache: write through
[1506258.922897]  sdb: sdb1 sdb2
[1506258.939633] sd 4:0:0:0: [sdb] Attached SCSI removable disk
```
In the above case the drive is sdb
2. Replace sdb in the following instructions with the device name for the SD card as it appears on your computer.
3. Start fdisk to partition the SD card:
```bash
sudo fdisk /dev/sdb
```
onp1
+100M
tc
np


w
At the fdisk prompt, delete old partitions and create a new one:
Type o. This will clear out any partitions on the drive.
Type p to list partitions. There should be no partitions left.
Type n, then p for primary, 1 for the first partition on the drive, press ENTER to accept the default first sector, then type +100M for the last sector.
Type t, then c to set the first partition to type W95 FAT32 (LBA).
Type n, then p for primary, 2 for the second partition on the drive, and then press ENTER twice to accept the default first and last sector.
Write the partition table and exit by typing w.
4. Create and mount the FAT filesystem:
```bash
sudo mkfs.vfat /dev/sdb1
mkdir boot
sudo mount /dev/sdb1 boot
```
5. Create and mount the ext4 filesystem:
```bash
sudo mkfs.ext4 /dev/sdb2
mkdir root
sudo mount /dev/sdb2 root
```
6. Download and extract the root filesystem (as root, not via sudo):
```bash
wget http://archlinuxarm.org/os/ArchLinuxARM-rpi-2-latest.tar.gz
sudo bsdtar -xpf ArchLinuxARM-rpi-2-latest.tar.gz -C root
sync
```
7. Move boot files to the first partition: ```sudo mv root/boot/* boot ```
8. Unmount the two partitions:
```bash
sudo umount boot root
```
9. Insert the SD card into the Raspberry Pi, connect ethernet, and apply 5V power.
Use the serial console or SSH to the IP address given to the board by your router. The default root password is 'root'.


## Setup ChillHub
After arch is running boot your pi and run the following:

#### setup base rpi packages

1. ```pacman -Syu --noconfirm``` (updates pacman package system and any packages from the image above)
2. ```pacman -Sy --noconfirm git``` (install git)
3. ```cd /root; git clone https://github.com/Quelab/green-bean-connect-utils```
4. ```cd green-bean-connect-utils/chillhub-host/; sh install``` (choose option 1)

#### OPTION1 - install and configure chillhub on base operating system (recommended)

1.  ```cd /root/green-bean-connect-utils/chillhub-host; sh install``` (choose option 3)

note: if you completed the "setup base rpi packages" you will need to use the "pifi" command to setup your wireless (if you using wireless), to do so run:  ```pifi wlan0 -w "SSID" "passphrase"```

The ChillHub firmware is now installed. To run it (need to restart after each pi reboot):

1. ```cd /root/green-bean-connect-utils/chillhub-host```
2. ```node chillhub```


#### OPTION2 - install and configure chillhub in docker containers

1.  ```cd /root/green-bean-connect-utils/chillhub-host; sh install``` (choose option 2)
2.  This will reboot the pi after docker has installed, *repeat the step above when you log back in*. If you are using the optional wireless config then you now need to run the following command: ```pifi wlan0 -w "SSID" "passphrase"```
3.  wait (this takes over an hour)
4.  After installation is finally complete, reboot
5. Generate chillhub config file: ```cd /root; curl -sL http://bit.ly/18TxiZJ |sh``` <--- yeah, not generally recommended to do this sort of thing. The file you want to run is create-json.sh. Feel free to download and run this manually.

